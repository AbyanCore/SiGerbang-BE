pub fn hashing<'a>(val: &'a str) -> String {
    use sha2::{Digest,Sha256};
    let mut hasher = Sha256::new();
    hasher.update(val);
    let result = hasher.finalize();
    format!("{:x}",result)
}