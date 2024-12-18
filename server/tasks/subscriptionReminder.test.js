import { sendReminderEmails } from './subscriptionReminder';
import nodemailer from 'nodemailer';
import { db } from '../config/database';

jest.mock('nodemailer');
jest.mock('../config/database');

describe('sendReminderEmails', () => {
  it('should send reminder emails', async () => {
    const mockQuery = jest.fn().mockResolvedValue([
      [
        { email: 'test@example.com', subscription_type: 'Monthly', end_date: '2023-12-31' },
      ],
    ]);
    db.query = mockQuery;

    const mockSendMail = jest.fn().mockImplementation((mailOptions, callback) => callback(null, { response: '250 OK' }));
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    await sendReminderEmails();

    expect(mockQuery).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'test@example.com' }),
      expect.any(Function)
    );
  });
});