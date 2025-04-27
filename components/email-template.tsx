import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>
      Welcome, {firstName}! Thanks for signing up to our waiting list for
      dinnersaurus! We will let you know when the app is ready!
    </h1>
  </div>
);
