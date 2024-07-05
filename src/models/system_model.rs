use serde::{ Deserialize, Serialize };

#[derive(Debug, Deserialize, Serialize)]
pub struct ResponseMessage<T> {
    pub data: T,
    pub message: String,
    pub status: i32,
}
