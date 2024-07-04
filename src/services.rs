use actix_web::{get,post,delete,put,web::{
    Data,Json,Path
}, HttpResponse, Responder};
use sha2::digest::impl_oid_carrier;
use crate::{
    messages::{MGetUser, MGetUsers, MPostUser, MPutUser}, models::{updateUser, ResponeMessage}, utils::hashing, AppState, DbActor
};
use serde::Deserialize;
use actix::Addr;

#[get("/users")]
pub async fn get_users(data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(MGetUsers).await {
        Ok(Ok(info)) => HttpResponse::Ok().json(ResponeMessage {
            status: 200,
            message: "Success".to_string(),
            data: info
        }),
        Ok(Err(e)) => HttpResponse::NotFound().json(e.to_string()),
        _ => HttpResponse::InternalServerError().json("Something went wrong")
    }
}

#[get("/users/{id}")]
pub async fn get_user(path: Path<i32>,data: Data<AppState>) -> impl Responder {
    let db = data.db.clone();
    match db.send(MGetUser {
        id: path.into_inner()
    }).await {
        Ok(Ok(info)) => HttpResponse::Ok().json(ResponeMessage {
            status: 200,
            message: "Success".to_string(),
            data: info
        }),
        Ok(Err(e)) => HttpResponse::NotFound().json(e.to_string()),
        _ => HttpResponse::InternalServerError().json("Something went wrong")
    }
}

#[post("/users")]
pub async fn post_user(data: Data<AppState>,body: Json<MPostUser>) -> impl Responder {
    let db = data.db.clone();
    match db.send(MPostUser {
        email: body.email.to_string(),
        username: body.username.to_string(),
        password: hashing(body.password.as_str()).to_string()
    }).await {
        Ok(Ok(info)) => HttpResponse::Ok().json(ResponeMessage {
            status: 200,
            message: "Success".to_string(),
            data: info
        }),
        Ok(Err(e)) => HttpResponse::NotFound().json(e.to_string()),
        _ => HttpResponse::InternalServerError().json("Something went wrong")
    }
}

#[put("/users/{id}")]
pub async fn put_user(path: Path<i32>,data: Data<AppState>,body: Json<updateUser>) -> impl Responder {
    let db = data.db.clone();
    match db.send(MPutUser {
        id: path.into_inner(),
        update_user: body.into_inner()
    }).await {
        Ok(Ok(info)) => HttpResponse::Ok().json(ResponeMessage {
            status: 200,
            message: "Success".to_string(),
            data: info
        }),
        Ok(Err(e)) => HttpResponse::NotFound().json(e.to_string()),
        _ => HttpResponse::InternalServerError().json("Something went wrong")
    }
}



#[get("/")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().json("Hello world!")
}