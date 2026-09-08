import React from "react";
import "../../assets/css/style.css";

export default function Footer() {
  return (
    <footer className="py-3 my-4">
      <p className="text-center text-muted">© {new Date().getFullYear()} College TnP Platform. All rights reserved.</p>
    </footer>
  );
}
