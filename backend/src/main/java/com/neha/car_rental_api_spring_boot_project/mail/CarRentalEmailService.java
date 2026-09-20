package com.neha.car_rental_api_spring_boot_project.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class CarRentalEmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendBookingRequestEmail(String ownerEmail, String customerName, String vehicleNumber) {
        String htmlBody = buildHtmlTemplate(
                "New booking request",
                "A new car booking request has been submitted.",
                new String[] {
                        "Customer: " + customerName,
                        "Vehicle Number: " + vehicleNumber,
                        "Please review and accept or reject the request from the dashboard."
                }
        );
        sendHtmlEmail(ownerEmail, "New Car Booking Request", htmlBody);
    }

    public void sendBookingConfirmedEmail(String customerEmail, String customerName, String vehicleNumber) {
        String htmlBody = buildHtmlTemplate(
                "Booking confirmed",
                "Your car booking has been confirmed successfully.",
                new String[] {
                        "Customer: " + customerName,
                        "Vehicle Number: " + vehicleNumber,
                        "Thank you for choosing our car rental service."
                }
        );
        sendHtmlEmail(customerEmail, "Car Booking Confirmed", htmlBody);
    }

    public void sendBookingRejectedEmail(String customerEmail, String customerName, String vehicleNumber) {
        String htmlBody = buildHtmlTemplate(
                "Booking update",
                "Your booking request has been rejected by the car owner.",
                new String[] {
                        "Customer: " + customerName,
                        "Vehicle Number: " + vehicleNumber,
                        "You can try another car or contact support for assistance."
                }
        );
        sendHtmlEmail(customerEmail, "Car Booking Rejected", htmlBody);
    }

    public void sendBookingCompletedEmail(String customerEmail, String customerName, String vehicleNumber) {
        String htmlBody = buildHtmlTemplate(
                "Ride completed",
                "Your ride has been completed successfully.",
                new String[] {
                        "Customer: " + customerName,
                        "Vehicle Number: " + vehicleNumber,
                        "We hope you enjoyed your trip with us."
                }
        );
        sendHtmlEmail(customerEmail, "Car Ride Completed", htmlBody);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
        } catch (MessagingException exception) {
            throw new RuntimeException("Failed to send HTML email: " + exception.getMessage(), exception);
        }
    }

    private String buildHtmlTemplate(String title, String intro, String[] items) {
        StringBuilder listItems = new StringBuilder();
        for (String item : items) {
            listItems.append("<li style='margin: 0 0 12px; color: #334155; font-size: 15px;'>")
                    .append(item)
                    .append("</li>");
        }

        return "<html><body style='margin:0; padding:0; background:#f8fafc; font-family:Arial,sans-serif;'>"
                + "<div style='max-width:640px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(15,23,42,0.08);'>"
                + "<div style='background:linear-gradient(135deg,#0f172a,#2563eb); padding:24px 28px;'>"
                + "<h2 style='margin:0; color:#ffffff; font-size:24px;'>" + title + "</h2>"
                + "</div>"
                + "<div style='padding:28px;'>"
                + "<p style='margin:0 0 18px; color:#475569; font-size:16px; line-height:1.7;'>" + intro + "</p>"
                + "<ul style='margin:0 0 18px; padding-left:20px;'>" + listItems + "</ul>"
                + "<p style='margin:0; color:#1e293b; font-weight:600; font-size:15px;'>Regards,<br>Car Rental Team</p>"
                + "</div>"
                + "</div>"
                + "</body></html>";
    }
}
