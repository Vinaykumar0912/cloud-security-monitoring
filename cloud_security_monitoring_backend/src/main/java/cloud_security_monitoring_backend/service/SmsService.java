package cloud_security_monitoring_backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private final String accountSid;
    private final String apiKey;
    private final String apiSecret;
    private final String twilioPhoneNumber;

    public SmsService(
            @Value("${twilio.account.sid}") String accountSid,
            @Value("${twilio.api.key}") String apiKey,
            @Value("${twilio.api.secret}") String apiSecret,
            @Value("${twilio.phone.number}") String twilioPhoneNumber) {

        this.accountSid = accountSid;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.twilioPhoneNumber = twilioPhoneNumber;
    }

    public void sendAlertSms(
            String recipient,
            String assetType,
            String assetStatus,
            String severity,
            String message) {

        Twilio.init(apiKey, apiSecret, accountSid);

        Message.creator(
                new PhoneNumber(recipient),
                new PhoneNumber(twilioPhoneNumber),
                "sms_account_alerts"
        ).create();
    }
}