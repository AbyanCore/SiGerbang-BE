use actix_web::web;
use crate::services::grub_service::*;

pub fn grub_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/users")
            .service(get_grubs)
            .service(get_grub)
            .service(create_grub)
            .service(update_grub)
            .service(delete_grub)
    );
}
