use std::env;

use actix::SyncArbiter;
use actix_web::{ web::Data, App, HttpServer };
use diesel::{ r2d2::{ ConnectionManager, Pool }, PgConnection };
use dotenv::dotenv;

mod database;
mod handlers;
mod models;
mod services;
mod utils;
mod routes;
mod websocket;

use database::db_utils::{ get_pool, AppState, DbActor };
use routes::{ grub_route::grub_routes, system_route::system_routes, user_route::user_routes };

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    // check env file
    dotenv().ok().expect("Failed to read .env file");

    let db_url: String = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool: Pool<ConnectionManager<PgConnection>> = get_pool(&db_url);
    let db_addr = SyncArbiter::start(5, move || DbActor(pool.clone()));

    // start server
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(AppState { db: db_addr.clone() }))
            .configure(user_routes)
            .configure(system_routes)
            .configure(grub_routes)
    })
        .bind(("localhost", 8080))?
        .run().await
}
