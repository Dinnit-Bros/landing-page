import { EmailTemplate } from "../../../components/email-template";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    console.log("API route /api/send was called");
    const resend = new Resend(process.env.RESEND_API_KEY);
    // return new Response(JSON.stringify({ message: "POST success (dummy)" }), {
    //   status: 200,
    // });

    // Parse the request body
    let email;
    try {
      const body = await req.json();
      email = body.email;
    } catch (jsonError) {
      console.error("Error parsing JSON body:", jsonError);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
      });
    }

    console.log("Email received to be sent:", email);

    // Validate email
    if (!email) {
      console.error("Email is missing in the request body");
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Generate the email template
    let emailContent;
    try {
      emailContent = await EmailTemplate({ firstName: email });
    } catch (templateError) {
      console.error("Error generating email template:", templateError);
      return new Response(
        JSON.stringify({ error: "Failed to generate email template" }),
        { status: 500 }
      );
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Dinnersaurus <no-reply@marketing.dinnersaurus.com>",
      to: [email],
      subject: "Welcome to Dinnersaurus!",
      react: emailContent,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
      });
    }

    console.log("Email sent successfully:", data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Unexpected error in API route:", error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
