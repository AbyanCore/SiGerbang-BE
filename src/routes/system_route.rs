use actix_web::web;

use crate::services::system_service::*;

pub fn system_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/system").service(index).service(time));
}
