use actix_web::web;
use crate::services::user_service::*;

pub fn user_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/users")
            .service(get_users)
            .service(get_user)
            .service(create_user)
            .service(update_user)
            .service(delete_user)
    );
}
