// @generated automatically by Diesel CLI.

diesel::table! {
    grub (uuid) {
        #[max_length = 50]
        uuid -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        description -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    grub_user (id) {
        id -> Int4,
        #[max_length = 50]
        grub_id -> Varchar,
        user_id -> Int4,
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

diesel::joinable!(grub_user -> grub (grub_id));
diesel::joinable!(grub_user -> user (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    grub,
    grub_user,
    user,
);
