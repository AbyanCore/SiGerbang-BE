use actix::Message;
use diesel::{ AsChangeset, Insertable, QueryResult };
use serde::{ Serialize, Deserialize };

use crate::database::schema::grub;
use crate::database::db_models::Grub;

#[derive(Debug, Serialize, Deserialize, Insertable, AsChangeset, Clone)]
#[diesel(table_name = grub)]
pub struct GrubData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
    pub name: String,
    pub description: String,
    pub author: i32,
}

#[derive(Debug, Deserialize, AsChangeset)]
#[diesel(table_name = grub)]
pub struct UpdateGrubData {
    pub name: Option<String>,
    pub description: Option<String>,
    pub author: Option<i32>,
}

#[derive(Message)]
#[rtype(result = "QueryResult<Vec<Grub>>")]
pub struct GetGrubs;

#[derive(Message, Deserialize)]
#[rtype(result = "QueryResult<Grub>")]
pub struct CreateGrub(pub GrubData);

#[derive(Message)]
#[rtype(result = "QueryResult<Grub>")]
pub struct GetGrub {
    pub uuid: String,
}

#[derive(Message, Deserialize)]
#[rtype(result = "QueryResult<Grub>")]
pub struct UpdateGrub {
    pub uuid: String,
    pub data: UpdateGrubData,
}

#[derive(Message)]
#[rtype(result = "QueryResult<usize>")]
pub struct DeleteGrub {
    pub uuid: String,
}
