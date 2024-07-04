use actix_web::{App, HttpResponse, HttpServer, Responder};

use dotenv::dotenv;

#[actix_web::get("/")]
pub async fn index() -> impl Responder {
    HttpResponse::Ok().json("Hello, Actix!")
}

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    // check env file
    dotenv().ok().expect("Failed to read .env file");
    // load databaseurl at env
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    println!("DATABASE_URL: {}", database_url);



    // start server
    HttpServer::new(|| {
        App::new().service(index)
    }).bind(("localhost",8080))?.run().await
}
