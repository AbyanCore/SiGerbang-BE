use actix_web::{ get, post, put, delete, web::{ Data, Json, Path }, HttpResponse, Responder };
use serde_json::json;
use crate::{
    models::{
        system_model::ResponseMessage,
        grub_model::{
            GetGrubs,
            GetGrub,
            CreateGrub,
            UpdateGrub,
            DeleteGrub,
            GrubData,
            UpdateGrubData,
        },
    },
    AppState,
};

#[get("/grubs")]
pub async fn get_grubs(data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(GetGrubs).await {
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

#[get("/grubs/{uuid}")]
pub async fn get_grub(path: Path<String>, data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(GetGrub { uuid: path.into_inner() }).await {
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

#[post("/grubs")]
pub async fn create_grub(data: Data<AppState>, body: Json<GrubData>) -> impl Responder {
    let db = data.db.clone();
    match db.send(CreateGrub(body.into_inner())).await {
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

#[put("/grubs/{uuid}")]
pub async fn update_grub(
    path: Path<String>,
    data: Data<AppState>,
    body: Json<UpdateGrubData>
) -> impl Responder {
    let db = data.db.clone();
    match db.send(UpdateGrub { uuid: path.into_inner(), data: body.into_inner() }).await {
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

#[delete("/grubs/{uuid}")]
pub async fn delete_grub(path: Path<String>, data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(DeleteGrub { uuid: path.into_inner() }).await {
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
