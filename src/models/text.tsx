import { InputOTPSlot } from "@/components/ui/input-otp"

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container{
            margin: 0 auto;
            max-width: 1140px;
            width: 100%;
            border: 1px solid #f2f2f23d;
            background-color: oklch(21% 0.006 285.885);
            color: #fff;
            padding: 1.25rem;
            border-radius: .5rem;
        }
        .center{
            text-align: center;
        }
        h2,p{
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="center">
            <img width="250" src="http://localhost:3000/images/white_logo.png" />
        </div>
        <h2>TWELVE COMMERCE</h2>
        <p>Seu código de verificação: </p>
        <InputOTP maxLength={6}>
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>
    </div>
</body>
</html>