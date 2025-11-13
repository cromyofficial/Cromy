import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, mobile, message, products } = await req.json();

    if (!name || !mobile) {
      return new Response(
        JSON.stringify({ message: "Name and Mobile are required" }),
        { status: 400 }
      );
    }

    // 🧩 Build product section for email
    const productList = products
      ?.map(
        (p, i) => `
        <div style="border:1px solid #ddd; padding:10px; border-radius:8px; margin-bottom:10px;">
          <p><strong>${i + 1}. ${p.name}</strong></p>
          <p><b>Intro:</b> ${p.intro || "N/A"}</p>
          <p><b>Variant:</b> ${p.variant || "N/A"}</p>
          <p><b>Status:</b> ${p.status || "N/A"}</p>
          ${
            p.image
              ? `<img src="${p.image}" alt="${p.name}" style="width:100px; height:auto; border-radius:6px; margin-top:6px;" />`
              : ""
          }
        </div>`
      )
      .join("");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App password only
      },
    });

    await transporter.sendMail({
      from: `"Checkout Form" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || "cromyofficial@gmail.com",
      subject: `🛍️ New Checkout Details from ${name}`,
      html: `
        <h2>🧾 Customer Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <hr style="margin:20px 0;" />
        <h2>🛒 Cart Product Details</h2>
        ${productList || "<p>No products found in cart.</p>"}
      `,
    });

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ message: "Error sending email", error }),
      { status: 500 }
    );
  }
}
