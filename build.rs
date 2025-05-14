use std::{
    io::{self, Write},
    process::Command,
};

fn main() {
    println!("cargo:rerun-if-changed=tailwind.css");
    println!("cargo:rerun-if-changed=src");

    println!("Regenerating tailwind classes");
    match Command::new("sh").arg("-c").arg("bun run build").output() {
        Ok(output) => {
            if !output.status.success() {
                let _ = io::stdout().write_all(&output.stdout);
                let _ = io::stdout().write_all(&output.stderr);
                panic!("Failed to execute tailwind command");
            }
        }
        Err(err) => panic!("Failed to execute tailwind command: {:?}", err),
    }
}
