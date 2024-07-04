use std::env;

use actix::SyncArbiter;
use actix_web::{web::Data, App, HttpResponse, HttpServer, Responder};
use diesel::{r2d2::{ConnectionManager, Pool}, PgConnection};
use dotenv::dotenv;

mod utils;
mod db_models;
mod db_utils;
mod schema;
mod services;
mod messages;
mod actors;
mod models;

use db_utils::{get_pool,AppState,DbActor};
use services::{
    get_user, get_users, index, post_user, put_user
};

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    // check env file
    dotenv().ok().expect("Failed to read .env file");

    let db_url : String = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool: Pool<ConnectionManager<PgConnection>> = get_pool(&db_url);
    let db_addr = SyncArbiter::start(5, move || DbActor(pool.clone()));

    // start server
    HttpServer::new(move || {
        App::new().app_data(Data::new(AppState {db: db_addr.clone()}))
            .service(index)
            .service(get_users)
            .service(get_user)
            .service(post_user)
            .service(put_user)
    }).bind(("localhost",8080))?.run().await
}
