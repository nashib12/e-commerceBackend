<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Confirm your subscription – Megastore</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a { text-decoration: none; }

        body {
            background-color: #F0F0EE;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1A1A1A;
            margin: 0;
            padding: 0;
        }

        .email-wrapper {
            width: 100%;
            background-color: #F0F0EE;
            padding: 48px 16px;
        }

        .email-container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .header {
            background-color: #111111;
            padding: 32px 40px;
            text-align: left;
        }

        .header-logo {
            font-size: 20px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        .header-logo span {
            color: #C8F04E;
        }

        .hero-strip {
            background-color: #C8F04E;
            padding: 6px 40px;
        }

        .hero-strip p {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #111111;
        }

        .body {
            padding: 40px 40px 32px;
        }

        .body h1 {
            font-size: 26px;
            font-weight: 700;
            color: #111111;
            line-height: 1.3;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }

        .body p {
            font-size: 15px;
            line-height: 1.7;
            color: #555555;
            margin-bottom: 12px;
        }

        .cta-wrapper {
            margin: 32px 0 28px;
            text-align: left;
        }

        .cta-button {
            display: inline-block;
            background-color: #111111;
            color: #C8F04E !important;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 16px 36px;
            border-radius: 2px;
            text-decoration: none;
        }

        .divider {
            border: none;
            border-top: 1px solid #EBEBEB;
            margin: 28px 0;
        }

        .url-fallback {
            font-size: 12px;
            color: #999999;
            line-height: 1.6;
            word-break: break-all;
        }

        .url-fallback a {
            color: #555555;
            text-decoration: underline;
        }

        .perks {
            background-color: #F9F9F7;
            border-left: 3px solid #C8F04E;
            padding: 20px 24px;
            margin: 28px 0 0;
            border-radius: 0 2px 2px 0;
        }

        .perks p.perks-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #999999;
            margin-bottom: 12px;
        }

        .perks ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .perks ul li {
            font-size: 13px;
            color: #444444;
            line-height: 1.6;
            padding: 3px 0;
            padding-left: 16px;
            position: relative;
        }

        .perks ul li::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #111111;
            font-size: 11px;
        }

        .footer {
            background-color: #111111;
            padding: 24px 40px;
            text-align: left;
        }

        .footer p {
            font-size: 11px;
            color: #888888;
            line-height: 1.7;
            margin-bottom: 4px;
        }

        .footer a {
            color: #C8F04E;
            text-decoration: underline;
            font-size: 11px;
        }

        @media only screen and (max-width: 560px) {
            .header, .hero-strip, .body, .footer {
                padding-left: 24px !important;
                padding-right: 24px !important;
            }
            .body h1 { font-size: 22px; }
            .cta-button { display: block; text-align: center; }
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-container">

        <div class="header">
            <div class="header-logo">Mega<span>store</span></div>
        </div>

        <div class="hero-strip">
            <p>One click away from exclusive deals</p>
        </div>

        <div class="body">
            <h1>Confirm your subscription</h1>

            <p>
                Thanks for signing up! You're almost in — just confirm your email address
                and we'll handle the rest.
            </p>

            <p>
                Once confirmed, you'll be the first to hear about new arrivals,
                members-only sales, and style picks curated for you.
            </p>

            <div class="cta-wrapper">
                <a href="{{ $verifyUrl }}" class="cta-button">Confirm my email</a>
            </div>

            <p style="font-size: 13px; color: #999999;">
                This link expires in <strong style="color: #555555;">24 hours</strong>.
                If you didn't subscribe, you can safely ignore this email.
            </p>

            <hr class="divider" />

            <p class="url-fallback">
                Button not working? Copy and paste this link into your browser:<br/>
                <p>{{ $verifyUrl }}</p>
            </p>

            <div class="perks">
                <p class="perks-label">What you'll get</p>
                <ul>
                    <li>Early access to new collections</li>
                    <li>Members-only discount codes</li>
                    <li>Restock alerts on sold-out items</li>
                    <li>No spam, ever — unsubscribe anytime</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>
                You're receiving this because someone signed up at
                <a href="#">https://megastore.com</a>
            </p>
            <p style="margin-top: 8px;">
                Don't want to hear from us?
                <a href="{{ $unsubscribeUrl }}">Unsubscribe instantly</a> — no questions asked.
            </p>
            <p style="margin-top: 12px; color: #555555;">
                © 2025 Megastore. All rights reserved.
            </p>
        </div>

    </div>
</div>
</body>
</html>