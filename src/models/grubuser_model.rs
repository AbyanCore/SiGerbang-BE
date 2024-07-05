use actix::Message;
use diesel::{ AsChangeset, Insertable, QueryResult };
use serde::{ Serialize, Deserialize };

// use crate::database::schema::grub_user;
// use crate::database::db_models::GrubUser;

// #[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
// #[diesel(diesel_type = "Role_user")]
// pub enum ROLEUSER {
//     Admin,
//     Member,
// }

// #[derive(Debug, Serialize, Deserialize, Insertable, AsChangeset, Clone)]
// #[diesel(table_name = grub_user)]
// pub struct GrubUserData {
//     #[serde(skip_serializing_if = "Option::is_none")]
//     pub id: Option<i32>,
//     pub grub_id: String,
//     pub user_id: i32,
//     pub user_role: String,
// }
