use actix_web::{ get, HttpResponse, Responder };

#[get("")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().json("Hello world!")
}

#[get("/time")]
pub async fn time() -> impl Responder {
    HttpResponse::Ok().json(chrono::Utc::now().to_rfc3339())
}
