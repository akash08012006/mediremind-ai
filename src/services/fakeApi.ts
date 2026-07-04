import { Reminder, Caretaker, CaretakerAlert, DashboardStats } from '../types';

const REMINDERS_KEY = 'mediremind_reminders';
const CARETAKER_KEY = 'mediremind_caretaker';
const ALERTS_KEY = 'mediremind_alerts';

// Seed initial data if nothing is in localStorage
const defaultReminders: Reminder[] = [
  {
    id: 'rem-1',
    medicineName: 'Paracetamol 500mg',
    dosage: '1 tablet',
    time: '8:00 AM',
    foodInstruction: 'After food',
    duration: '5 days',
    status: 'Pending',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'rem-2',
    medicineName: 'Cetirizine 10mg',
    dosage: '1 tablet',
    time: '9:00 PM',
    foodInstruction: 'After food',
    duration: '3 days',
    status: 'Taken',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'rem-3',
    medicineName: 'Vitamin D3',
    dosage: '1 tablet',
    time: '7:00 AM',
    foodInstruction: 'After food',
    duration: '10 days',
    status: 'Missed',
    createdAt: Date.now() - 3600000 * 24,
  }
];

const defaultCaretaker: Caretaker = {
  patientName: 'Akash',
  caretakerName: 'Ramesh Kumar',
  caretakerContact: 'ramesh.kumar@example.com'
};

const defaultAlerts: CaretakerAlert[] = [
  {
    id: 'alert-1',
    patientName: 'Akash',
    message: 'Alert: Akash missed Vitamin D3 at 7:00 AM',
    timestamp: Date.now() - 3600000 * 24,
  }
];

function initializeLocalStorage() {
  if (!localStorage.getItem(REMINDERS_KEY)) {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(defaultReminders));
  }
  if (!localStorage.getItem(CARETAKER_KEY)) {
    localStorage.setItem(CARETAKER_KEY, JSON.stringify(defaultCaretaker));
  }
  if (!localStorage.getItem(ALERTS_KEY)) {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(defaultAlerts));
  }
}

// Run immediately upon import
initializeLocalStorage();

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const fakeApi = {
  async getReminders(): Promise<Reminder[]> {
    await delay();
    const data = localStorage.getItem(REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> {
    await delay();
    const reminders = await this.getReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: `rem-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    reminders.unshift(newReminder); // Add new reminders at the top
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    return newReminder;
  },

  async updateReminder(id: string, updatedData: Partial<Reminder>): Promise<Reminder> {
    await delay();
    const reminders = await this.getReminders();
    const index = reminders.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    // Check if status changed to 'Missed'
    const oldStatus = reminders[index].status;
    const newStatus = updatedData.status;

    reminders[index] = {
      ...reminders[index],
      ...updatedData
    };
    
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));

    // If status transitioned to Missed, automatically add an alert
    if (newStatus === 'Missed' && oldStatus !== 'Missed') {
      const caretaker = await this.getCaretaker();
      const patient = caretaker?.patientName || 'Patient';
      await this.addMissedAlert(
        patient, 
        `Alert: ${patient} missed ${reminders[index].medicineName} at ${reminders[index].time}`
      );
    }

    return reminders[index];
  },

  async deleteReminder(id: string): Promise<boolean> {
    await delay();
    const reminders = await this.getReminders();
    const filtered = reminders.filter(r => r.id !== id);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
    return true;
  },

  async getCaretaker(): Promise<Caretaker | null> {
    await delay();
    const data = localStorage.getItem(CARETAKER_KEY);
    return data ? JSON.parse(data) : null;
  },

  async saveCaretaker(caretaker: Caretaker): Promise<Caretaker> {
    await delay();
    localStorage.setItem(CARETAKER_KEY, JSON.stringify(caretaker));
    return caretaker;
  },

  async getMissedAlerts(): Promise<CaretakerAlert[]> {
    await delay();
    const data = localStorage.getItem(ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addMissedAlert(patientName: string, message: string): Promise<CaretakerAlert> {
    const alerts = await this.getMissedAlerts();
    const newAlert: CaretakerAlert = {
      id: `alert-${Math.random().toString(36).substr(2, 9)}`,
      patientName,
      message,
      timestamp: Date.now()
    };
    alerts.unshift(newAlert);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    return newAlert;
  },

  async deleteAlert(id: string): Promise<boolean> {
    await delay();
    const alerts = await this.getMissedAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(filtered));
    return true;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    const reminders = await this.getReminders();
    const total = reminders.length;
    const taken = reminders.filter(r => r.status === 'Taken').length;
    const missed = reminders.filter(r => r.status === 'Missed').length;
    const pending = reminders.filter(r => r.status === 'Pending').length;
    
    return {
      total,
      taken,
      missed,
      pending
    };
  },

  getOcrDemoData() {
    return [
      {
        medicineName: 'Paracetamol 500mg',
        dosage: '1 tablet',
        time: '8:00 AM & 8:00 PM', // Morning and Night
        foodInstruction: 'After food' as const,
        duration: '5 days',
        status: 'Pending' as const
      },
      {
        medicineName: 'Cetirizine 10mg',
        dosage: '1 tablet',
        time: '9:00 PM', // Night
        foodInstruction: 'After food' as const,
        duration: '3 days',
        status: 'Pending' as const
      }
    ];
  },

  getOcrAccuracy() {
    const levels = [
      { level: 'Excellent', score: 96, color: 'emerald', message: 'Scan quality is exceptional. All fields extracted with high confidence.' },
      { level: 'Good', score: 88, color: 'blue', message: 'Scan quality is good. Most fields extracted successfully with minor variations.' },
      { level: 'Fair', score: 72, color: 'amber', message: 'Scan quality is fair. Some fields may need manual verification.' },
      { level: 'Poor', score: 55, color: 'orange', message: 'Scan quality is poor. Please ensure good lighting and re-scan if possible.' },
      { level: 'Failure', score: 0, color: 'red', message: 'Scan failed. Please upload a clearer prescription image.' }
    ];
    return levels[Math.floor(Math.random() * levels.length)];
  }
};
