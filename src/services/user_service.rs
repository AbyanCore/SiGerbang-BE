use actix_web::{ get, post, put, delete, web::{ Data, Json, Path }, HttpResponse, Responder };
use serde_json::json;
use crate::{
    models::{
        system_model::ResponseMessage,
        user_model::{
            GetUsers,
            GetUser,
            CreateUser,
            UpdateUser,
            DeleteUser,
            UserData,
            UpdateUserData,
        },
    },
    utils::secure::hashing,
    AppState,
};

#[get("/users")]
pub async fn get_users(data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(GetUsers).await {
        Ok(Ok(info)) =>
            HttpResponse::Ok().json(ResponseMessage {
                status: 200,
                message: "Success".to_string(),
                data: info,
            }),
        Ok(Err(e)) =>
            HttpResponse::NotFound().json(ResponseMessage {
                status: 404,
                message: e.to_string(),
                data: json!(null),
            }),
        _ =>
            HttpResponse::InternalServerError().json(ResponseMessage {
                status: 500,
                message: "Something went wrong".to_string(),
                data: json!(null),
            }),
    }
}

#[get("/users/{id}")]
pub async fn get_user(path: Path<i32>, data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(GetUser { id: path.into_inner() }).await {
        Ok(Ok(info)) =>
            HttpResponse::Ok().json(ResponseMessage {
                status: 200,
                message: "Success".to_string(),
                data: info,
            }),
        Ok(Err(e)) =>
            HttpResponse::NotFound().json(ResponseMessage {
                status: 404,
                message: e.to_string(),
                data: json!(null),
            }),
        _ =>
            HttpResponse::InternalServerError().json(ResponseMessage {
                status: 500,
                message: "Something went wrong".to_string(),
                data: json!(null),
            }),
    }
}

#[post("/users")]
pub async fn create_user(data: Data<AppState>, body: Json<UserData>) -> impl Responder {
    let db = data.db.clone();
    let hashed_password = hashing(&body.password);
    let user_data = UserData {
        id: None,
        email: body.email.clone(),
        username: body.username.clone(),
        password: hashed_password,
    };
    match db.send(CreateUser(user_data)).await {
        Ok(Ok(info)) =>
            HttpResponse::Ok().json(ResponseMessage {
                status: 200,
                message: "Success".to_string(),
                data: info,
            }),
        Ok(Err(e)) =>
            HttpResponse::NotFound().json(ResponseMessage {
                status: 404,
                message: e.to_string(),
                data: json!(null),
            }),
        _ =>
            HttpResponse::InternalServerError().json(ResponseMessage {
                status: 500,
                message: "Something went wrong".to_string(),
                data: json!(null),
            }),
    }
}

#[put("/users/{id}")]
pub async fn update_user(
    path: Path<i32>,
    data: Data<AppState>,
    body: Json<UpdateUserData>
) -> impl Responder {
    let db = data.db.clone();
    let user_id = path.into_inner();
    let mut update_data = body.into_inner();

    // If password is provided, hash it
    if let Some(ref password) = update_data.password {
        update_data.password = Some(hashing(password));
    }

    match db.send(UpdateUser { id: user_id, data: update_data }).await {
        Ok(Ok(info)) =>
            HttpResponse::Ok().json(ResponseMessage {
                status: 200,
                message: "Success".to_string(),
                data: info,
            }),
        Ok(Err(e)) =>
            HttpResponse::NotFound().json(ResponseMessage {
                status: 404,
                message: e.to_string(),
                data: json!(null),
            }),
        _ =>
            HttpResponse::InternalServerError().json(ResponseMessage {
                status: 500,
                message: "Something went wrong".to_string(),
                data: json!(null),
            }),
    }
}

#[delete("/users/{id}")]
pub async fn delete_user(path: Path<i32>, data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(DeleteUser { id: path.into_inner() }).await {
        Ok(Ok(count)) => {
            if count > 0 {
                HttpResponse::Ok().json(ResponseMessage {
                    status: 200,
                    message: "User deleted successfully".to_string(),
                    data: count,
                })
            } else {
                HttpResponse::NotFound().json(ResponseMessage {
                    status: 404,
                    message: "User Not Found".to_string(),
                    data: json!(null),
                })
            }
        }
        Ok(Err(e)) =>
            HttpResponse::NotFound().json(ResponseMessage {
                status: 404,
                message: e.to_string(),
                data: json!(null),
            }),
        _ =>
            HttpResponse::InternalServerError().json(ResponseMessage {
                status: 500,
                message: "Something went wrong".to_string(),
                data: json!(null),
            }),
    }
}
