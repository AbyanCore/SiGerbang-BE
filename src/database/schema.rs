// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "user_role"))]
    pub struct UserRole;
}

diesel::table! {
    grub (uuid) {
        #[max_length = 50]
        uuid -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        author -> Int4,
        description -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::UserRole;

    grub_user (id) {
        id -> Int4,
        #[max_length = 50]
        grub_id -> Varchar,
        user_id -> Int4,
        user_role -> UserRole,
        created_at -> Timestamp,
    }
}

diesel::table! {
    user (id) {
        id -> Int4,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(grub -> user (author));
diesel::joinable!(grub_user -> grub (grub_id));
diesel::joinable!(grub_user -> user (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    grub,
    grub_user,
    user,
);
