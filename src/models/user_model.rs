use actix::Message;
use diesel::{ AsChangeset, Insertable, QueryResult };
use serde::{ Deserialize, Serialize };

use crate::database::schema::user;
use crate::database::db_models::User;

#[derive(Debug, Serialize, Deserialize, Insertable, AsChangeset, Clone)]
#[diesel(table_name = user)]
pub struct UserData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, AsChangeset)]
#[diesel(table_name = user)]
pub struct UpdateUserData {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
}

#[derive(Message)]
#[rtype(result = "QueryResult<Vec<User>>")]
pub struct GetUsers;

#[derive(Message, Deserialize)]
#[rtype(result = "QueryResult<User>")]
pub struct CreateUser(pub UserData);

#[derive(Message)]
#[rtype(result = "QueryResult<User>")]
pub struct GetUser {
    pub id: i32,
}

#[derive(Message, Deserialize)]
#[rtype(result = "QueryResult<User>")]
pub struct UpdateUser {
    pub id: i32,
    pub data: UpdateUserData,
}

#[derive(Message)]
#[rtype(result = "QueryResult<usize>")]
pub struct DeleteUser {
    pub id: i32,
}
