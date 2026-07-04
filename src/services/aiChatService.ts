import { fakeApi } from './fakeApi';
import { Reminder, Caretaker, CaretakerAlert } from '../types';

const CHAT_HISTORY_KEY = 'mediremind_ai_chat_history';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestedActions?: string[];
}

const DISCLAIMER = 'Please follow your doctor\'s prescription. I do not provide medical advice.';

const BLOCKED_PATTERNS = [
  /should\s+i\s+stop/i,
  /should\s+i\s+start/i,
  /is\s+this\s+medicine\s+safe/i,
  /can\s+i\s+increase/i,
  /can\s+i\s+decrease/i,
  /which\s+medicine\s+is\s+better/i,
  /am\s+i\s+sick/i,
  /can\s+you\s+diagnose/i,
  /what\s+should\s+i\s+take/i,
  /what\s+should\s+i\s+do\s+if/i,
  /what\s+treatment\s+should/i,
  /diagnose/i,
  /cure/i,
  /safe\s+for\s+pregnant/i,
  /side\s+effect/i,
  /interaction/i,
  /overdose/i,
  /toxic/i,
  /can\s+i\s+take\s+another/i,
  /should\s+i\s+stop\s+this/i,
  /can\s+i\s+stop/i,
];

function isMedicalAdviceQuestion(text: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(text));
}

function getCurrentTimeString(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function getTimeMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 9999;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getTodayReminders(reminders: Reminder[]): Reminder[] {
  return reminders.filter(() => true);
}

function getNextReminder(reminders: Reminder[]): Reminder | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const pending = reminders
    .filter(r => r.status === 'Pending')
    .sort((a, b) => getTimeMinutes(a.time) - getTimeMinutes(b.time));
  return pending.find(r => getTimeMinutes(r.time) > currentMinutes) || pending[0] || null;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChatHistory(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-100)));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const MEDICINE_KNOWLEDGE_BASE: Record<string, {
  genericName: string;
  category: string;
  purpose: string;
  commonSideEffects: string;
  foodAdvice: string;
  precautions: string;
  storage: string;
}> = {
  'paracetamol': {
    genericName: 'Acetaminophen',
    category: 'Pain Reliever/Fever Reducer',
    purpose: 'Fever and mild pain relief',
    commonSideEffects: 'Nausea, stomach discomfort, allergic reactions (rare)',
    foodAdvice: 'Take after meals and drink sufficient water. Avoid alcohol.',
    precautions: 'Do not exceed prescribed dosage. Avoid use with other paracetamol-containing products. Consult doctor if symptoms persist beyond 3 days.',
    storage: 'Store below 25°C. Keep away from direct sunlight and moisture.'
  },
  'acetaminophen': {
    genericName: 'Acetaminophen',
    category: 'Pain Reliever/Fever Reducer',
    purpose: 'Fever and mild pain relief',
    commonSideEffects: 'Nausea, stomach discomfort, allergic reactions (rare)',
    foodAdvice: 'Take after meals and drink sufficient water. Avoid alcohol.',
    precautions: 'Do not exceed prescribed dosage. Avoid use with other paracetamol-containing products. Consult doctor if symptoms persist beyond 3 days.',
    storage: 'Store below 25°C. Keep away from direct sunlight and moisture.'
  },
  'cetirizine': {
    genericName: 'Cetirizine',
    category: 'Antihistamine',
    purpose: 'Allergy relief, runny nose, sneezing, itchy eyes',
    commonSideEffects: 'Drowsiness, dry mouth, fatigue, headache',
    foodAdvice: 'Avoid alcohol and activities requiring alertness if drowsy. Can be taken with or without food.',
    precautions: 'May cause drowsiness. Avoid driving or operating machinery if affected. Consult doctor if pregnant or breastfeeding.',
    storage: 'Store in a cool, dry place away from moisture and direct sunlight.'
  },
  'vitamin d3': {
    genericName: 'Cholecalciferol',
    category: 'Vitamin Supplement',
    purpose: 'Vitamin D supplementation for bone health',
    commonSideEffects: 'Usually well tolerated. Rare: nausea, constipation, weakness.',
    foodAdvice: 'Take after meals for better absorption. Fatty meals may enhance absorption.',
    precautions: 'Do not exceed recommended dose. Consult doctor if you have kidney disease or hypercalcemia.',
    storage: 'Keep away from moisture. Store in original container at room temperature.'
  },
  'amoxicillin': {
    genericName: 'Amoxicillin',
    category: 'Antibiotic (Penicillin)',
    purpose: 'Treatment of bacterial infections',
    commonSideEffects: 'Diarrhea, nausea, rash, allergic reactions',
    foodAdvice: 'Can be taken with or without food. Taking with food may reduce stomach upset.',
    precautions: 'Complete the full course even if you feel better. Inform doctor of any allergies to penicillin. May reduce effectiveness of birth control pills.',
    storage: 'Store below 25°C. Refrigerate liquid form if applicable. Keep away from moisture.'
  },
  'omeprazole': {
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor',
    purpose: 'Reduces stomach acid, treats ulcers and GERD',
    commonSideEffects: 'Headache, stomach pain, nausea, diarrhea',
    foodAdvice: 'Take 30 minutes before meals, preferably before breakfast.',
    precautions: 'Long-term use may increase risk of bone fractures. Consult doctor if symptoms persist beyond 14 days.',
    storage: 'Store at room temperature away from moisture and heat.'
  },
  'metformin': {
    genericName: 'Metformin',
    category: 'Antidiabetic (Biguanide)',
    purpose: 'Controls blood sugar levels in type 2 diabetes',
    commonSideEffects: 'Diarrhea, nausea, stomach upset, metallic taste',
    foodAdvice: 'Take with meals to reduce stomach upset. Avoid excessive alcohol.',
    precautions: 'Monitor blood sugar regularly. Hold dose and consult doctor if undergoing imaging with contrast dye.',
    storage: 'Store at room temperature away from moisture and heat.'
  },
  'azithromycin': {
    genericName: 'Azithromycin',
    category: 'Antibiotic (Macrolide)',
    purpose: 'Treatment of bacterial infections',
    commonSideEffects: 'Nausea, diarrhea, stomach pain, headache',
    foodAdvice: 'Can be taken with or without food. Taking with food may reduce stomach upset.',
    precautions: 'Complete the full course. Inform doctor of heart rhythm problems. May interact with certain medications.',
    storage: 'Store at room temperature away from moisture and heat.'
  }
};

function getMedicineInfo(medicineName: string): { name: string; info: typeof MEDICINE_KNOWLEDGE_BASE[string] } | null {
  const normalized = medicineName.toLowerCase().trim();
  if (MEDICINE_KNOWLEDGE_BASE[normalized]) {
    return { name: medicineName, info: MEDICINE_KNOWLEDGE_BASE[normalized] };
  }
  
  for (const key of Object.keys(MEDICINE_KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { name: medicineName, info: MEDICINE_KNOWLEDGE_BASE[key] };
    }
  }
  
  return null;
}

function formatMedicineDetails(medicineName: string, reminder: Reminder, medicineInfo?: any): string {
  let response = `Medicine Name: ${reminder.medicineName}\n`;
  
  if (medicineInfo && medicineInfo.info) {
    response += `Generic Name: ${medicineInfo.info.genericName}\n`;
    response += `Category: ${medicineInfo.info.category}\n`;
  } else {
    const info = getMedicineInfo(reminder.medicineName);
    if (info) {
      response += `Generic Name: ${info.info.genericName}\n`;
      response += `Category: ${info.info.category}\n`;
    } else {
      response += `Generic Name: Not available in knowledge base\n`;
      response += `Category: Please consult your doctor\n`;
    }
  }
  
  response += `Dosage: ${reminder.dosage}\n`;
  response += `Timing: ${reminder.time}\n`;
  response += `Food Instruction: ${reminder.foodInstruction}\n`;
  response += `Duration: ${reminder.duration}\n`;
  
  if (medicineInfo && medicineInfo.info) {
    response += `Purpose: ${medicineInfo.info.purpose}\n`;
    response += `Common Side Effects: ${medicineInfo.info.commonSideEffects}\n`;
    response += `Food Advice: ${medicineInfo.info.foodAdvice}\n`;
    response += `Precautions: ${medicineInfo.info.precautions}\n`;
    response += `Storage: ${medicineInfo.info.storage}\n`;
  } else {
    const info = getMedicineInfo(reminder.medicineName);
    if (info) {
      response += `Purpose: ${info.info.purpose}\n`;
      response += `Common Side Effects: ${info.info.commonSideEffects}\n`;
      response += `Food Advice: ${info.info.foodAdvice}\n`;
      response += `Precautions: ${info.info.precautions}\n`;
      response += `Storage: ${info.info.storage}\n`;
    } else {
      response += `Purpose: Please consult your doctor\n`;
      response += `Common Side Effects: Please consult your doctor\n`;
      response += `Food Advice: Please consult your doctor\n`;
      response += `Precautions: Please consult your doctor\n`;
      response += `Storage: Please consult your doctor\n`;
    }
  }
  
  response += `Reminder Status: ${reminder.status}\n`;
  
  if (reminder.status === 'Pending') {
    const next = getNextReminder([reminder]);
    if (next) {
      response += `Next Reminder: ${next.time}\n`;
    } else {
      response += `Next Reminder: ${reminder.time}\n`;
    }
  } else {
    response += `Next Reminder: Check your schedule for upcoming doses\n`;
  }
  
  response += `\n${DISCLAIMER}`;
  return response;
}

export async function processUserMessage(userMessage: string): Promise<ChatMessage> {
  const lowerMessage = userMessage.toLowerCase().trim();
  let responseText = '';
  let suggestedActions: string[] = [];

  if (isMedicalAdviceQuestion(lowerMessage)) {
    responseText = 'I cannot provide medical advice, diagnosis, or treatment recommendations. Please consult your doctor or healthcare professional.';
    suggestedActions = [
      'What medicine should I take now?',
      'Show today\'s medicines',
      'Show my caretaker details',
    ];
    return {
      id: generateId(),
      role: 'assistant',
      content: `${responseText}\n\n${DISCLAIMER}`,
      timestamp: Date.now(),
      suggestedActions,
    };
  }

  const reminders = await fakeApi.getReminders();
  const caretaker = await fakeApi.getCaretaker();
  const alerts = await fakeApi.getMissedAlerts();

  const todayReminders = getTodayReminders(reminders);
  const pendingReminders = todayReminders.filter(r => r.status === 'Pending');
  const missedReminders = todayReminders.filter(r => r.status === 'Missed');
  const takenReminders = todayReminders.filter(r => r.status === 'Taken');
  const nextReminder = getNextReminder(reminders);

  const nowTime = getCurrentTimeString();

  // Medicine info questions
  if (lowerMessage.includes('tell me about') || lowerMessage.includes('info about') || lowerMessage.includes('information about') || 
      lowerMessage.includes('what is') || lowerMessage.includes('details about') || lowerMessage.includes('know about')) {
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'cetirizine', 'vitamin d3', 'cholecalciferol', 'amoxicillin', 'omeprazole', 'metformin', 'azithromycin'];
    const foundMedicine = medicineKeywords.find(key => lowerMessage.includes(key));
    
    if (foundMedicine) {
      const matchingReminder = reminders.find(r => r.medicineName.toLowerCase().includes(foundMedicine));
      const medicineInfo = getMedicineInfo(foundMedicine);
      
      if (matchingReminder) {
        responseText = formatMedicineDetails(matchingReminder.medicineName, matchingReminder, medicineInfo);
      } else if (medicineInfo) {
        responseText = `Medicine Name: ${foundMedicine.charAt(0).toUpperCase() + foundMedicine.slice(1)}\n`;
        responseText += `Generic Name: ${medicineInfo.info.genericName}\n`;
        responseText += `Category: ${medicineInfo.info.category}\n`;
        responseText += `Dosage: Not in current schedule\n`;
        responseText += `Timing: Not in current schedule\n`;
        responseText += `Food Instruction: Please consult your doctor\n`;
        responseText += `Duration: Please consult your doctor\n`;
        responseText += `Purpose: ${medicineInfo.info.purpose}\n`;
        responseText += `Common Side Effects: ${medicineInfo.info.commonSideEffects}\n`;
        responseText += `Food Advice: ${medicineInfo.info.foodAdvice}\n`;
        responseText += `Precautions: ${medicineInfo.info.precautions}\n`;
        responseText += `Storage: ${medicineInfo.info.storage}\n`;
        responseText += `Reminder Status: Not scheduled\n`;
        responseText += `Next Reminder: Not scheduled\n\n`;
        responseText += DISCLAIMER;
      } else {
        responseText = `I don't have detailed information about "${foundMedicine}" in my knowledge base. Please consult your doctor or pharmacist for accurate information about this medicine.\n\n${DISCLAIMER}`;
      }
      suggestedActions = ['Show today\'s medicines', 'Show my prescription', 'Show medicine history'];
    } else {
      responseText = 'Please specify which medicine you want information about. For example: "Tell me about Paracetamol" or "Show details about Cetirizine".\n\n' + DISCLAIMER;
      suggestedActions = ['Show today\'s medicines', 'Show my prescription', 'What medicine should I take now?'];
    }
  } else if (lowerMessage.includes('side effect') || lowerMessage.includes('sideeffects')) {
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'cetirizine', 'vitamin d3', 'cholecalciferol', 'amoxicillin', 'omeprazole', 'metformin', 'azithromycin'];
    const foundMedicine = medicineKeywords.find(key => lowerMessage.includes(key));
    
    if (foundMedicine) {
      const medicineInfo = getMedicineInfo(foundMedicine);
      if (medicineInfo) {
        responseText = `Side Effects of ${foundMedicine.charAt(0).toUpperCase() + foundMedicine.slice(1)}:\n\nCommon Side Effects:\n${medicineInfo.info.commonSideEffects}\n\nPlease consult your doctor if you experience any severe or unexpected side effects.\n\n${DISCLAIMER}`;
      } else {
        responseText = `I don't have side effect information for "${foundMedicine}" in my knowledge base. Please consult your doctor or pharmacist.\n\n${DISCLAIMER}`;
      }
    } else {
      responseText = 'Please specify which medicine you want side effect information for. For example: "Show side effects of Paracetamol".\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Tell me about Paracetamol', 'Show medicine history'];
  } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('meal')) {
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'cetirizine', 'vitamin d3', 'cholecalciferol', 'amoxicillin', 'omeprazole', 'metformin', 'azithromycin'];
    const foundMedicine = medicineKeywords.find(key => lowerMessage.includes(key));
    
    if (foundMedicine) {
      const matchingReminder = reminders.find(r => r.medicineName.toLowerCase().includes(foundMedicine));
      const medicineInfo = getMedicineInfo(foundMedicine);
      
      if (matchingReminder) {
        responseText = `According to your prescription, ${matchingReminder.medicineName} should be taken ${matchingReminder.foodInstruction.toLowerCase()}.\n\n`;
      } else if (medicineInfo) {
        responseText = `Food guidance for ${foundMedicine.charAt(0).toUpperCase() + foundMedicine.slice(1)}:\n\n`;
      }
      
      if (medicineInfo) {
        responseText += `Food Advice:\n${medicineInfo.info.foodAdvice}\n\nGeneral recommendations:\n• Eat light meals.\n• Drink plenty of water.\n• Avoid alcohol unless instructed otherwise by your doctor.\n• Follow the dietary instructions provided by your healthcare professional.\n\n${DISCLAIMER}`;
      } else {
        responseText += 'Please consult your doctor for specific food guidance related to this medicine.\n\n' + DISCLAIMER;
      }
    } else {
      responseText = 'Please specify which medicine you want food guidance for. For example: "What should I eat with Paracetamol?"\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Tell me about Cetirizine', 'What medicine should I take now?'];
  } else if (lowerMessage.includes('precaution')) {
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'cetirizine', 'vitamin d3', 'cholecalciferol', 'amoxicillin', 'omeprazole', 'metformin', 'azithromycin'];
    const foundMedicine = medicineKeywords.find(key => lowerMessage.includes(key));
    
    if (foundMedicine) {
      const medicineInfo = getMedicineInfo(foundMedicine);
      if (medicineInfo) {
        responseText = `Precautions for ${foundMedicine.charAt(0).toUpperCase() + foundMedicine.slice(1)}:\n\n${medicineInfo.info.precautions}\n\nPlease consult your doctor for complete precautions and warnings.\n\n${DISCLAIMER}`;
      } else {
        responseText = `I don't have precaution information for "${foundMedicine}" in my knowledge base. Please consult your doctor or pharmacist.\n\n${DISCLAIMER}`;
      }
    } else {
      responseText = 'Please specify which medicine you want precaution information for.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Tell me about Paracetamol', 'Show medicine history'];
  } else if (lowerMessage.includes('storage') || lowerMessage.includes('store')) {
    const medicineKeywords = ['paracetamol', 'acetaminophen', 'cetirizine', 'vitamin d3', 'cholecalciferol', 'amoxicillin', 'omeprazole', 'metformin', 'azithromycin'];
    const foundMedicine = medicineKeywords.find(key => lowerMessage.includes(key));
    
    if (foundMedicine) {
      const medicineInfo = getMedicineInfo(foundMedicine);
      if (medicineInfo) {
        responseText = `Storage Instructions for ${foundMedicine.charAt(0).toUpperCase() + foundMedicine.slice(1)}:\n\n${medicineInfo.info.storage}\n\nAlways follow the storage instructions on the medicine label.\n\n${DISCLAIMER}`;
      } else {
        responseText = `I don't have storage information for "${foundMedicine}" in my knowledge base. Please consult your doctor or pharmacist.\n\n${DISCLAIMER}`;
      }
    } else {
      responseText = 'Please specify which medicine you want storage information for.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Tell me about Cetirizine', 'Show medicine history'];
  } else if (lowerMessage.includes('which tablet should i take now') || lowerMessage.includes('what should i take') || lowerMessage.includes('current medicine') || lowerMessage.includes('what medicine should i take')) {
    if (nextReminder) {
      responseText = `You should take:\n\nMedicine: ${nextReminder.medicineName}\nDosage: ${nextReminder.dosage}\nTime: ${nextReminder.time}\nInstruction: ${nextReminder.foodInstruction}\nDuration: ${nextReminder.duration}\n\nPlease follow your doctor's prescription.\n\n${DISCLAIMER}`;
    } else {
      responseText = 'You have no pending medicines scheduled for right now. Please check your reminders for upcoming doses.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Show upcoming reminders', 'Show pending medicines'];
  } else if (lowerMessage.includes('show today\'s medicines') || lowerMessage.includes('today\'s schedule') || lowerMessage.includes('today medicines') || lowerMessage.includes('today medicine')) {
    if (todayReminders.length === 0) {
      responseText = 'You have no medicines scheduled for today.\n\n' + DISCLAIMER;
    } else {
      const list = todayReminders.map(r => `• ${r.medicineName} - ${r.dosage} at ${r.time} (${r.foodInstruction}) - ${r.status}`).join('\n');
      responseText = `Here are your medicines for today:\n\n${list}\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    }
    suggestedActions = ['Show pending medicines', 'Show missed medicines', 'What medicine should I take now?'];
  } else if (lowerMessage.includes('did i miss') || lowerMessage.includes('missed medicines') || lowerMessage.includes('missed medicine')) {
    if (missedReminders.length === 0) {
      responseText = 'Great news! You have not missed any medicines today.\n\n' + DISCLAIMER;
    } else {
      const list = missedReminders.map(r => `• ${r.medicineName} at ${r.time} (${r.foodInstruction})`).join('\n');
      responseText = `You missed the following medicines:\n\n${list}\n\nPlease try to take them as soon as possible or consult your doctor if you missed a dose.\n\n${DISCLAIMER}`;
    }
    suggestedActions = ['Show medicine history', 'Show today\'s medicines', 'Show caretaker details'];
  } else if (lowerMessage.includes('pending') || lowerMessage.includes('upcoming') || lowerMessage.includes('what is pending')) {
    if (pendingReminders.length === 0) {
      responseText = 'You have no pending medicines at this time. All scheduled medicines have been taken or the schedule is complete for today.\n\n' + DISCLAIMER;
    } else {
      const list = pendingReminders.map(r => `• ${r.medicineName} - ${r.dosage} at ${r.time} (${r.foodInstruction})`).join('\n');
      responseText = `You have ${pendingReminders.length} pending medicine(s):\n\n${list}\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    }
    suggestedActions = ['What medicine should I take now?', 'Show today\'s medicines', 'Show upcoming reminders'];
  } else if (lowerMessage.includes('show my prescription') || lowerMessage.includes('prescription') || lowerMessage.includes('ocr') || lowerMessage.includes('uploaded prescription')) {
    const ocrData = fakeApi.getOcrDemoData();
    if (ocrData && ocrData.length > 0) {
      const list = ocrData.map(r => `• ${r.medicineName} - ${r.dosage} at ${r.time} (${r.foodInstruction}) for ${r.duration}`).join('\n');
      responseText = `Here is your prescription summary:\n\n${list}\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    } else {
      responseText = 'No prescription data found. Please upload a prescription to view your medicine schedule.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Upload prescription', 'Show medicine history'];
  } else if (lowerMessage.includes('next reminder') || lowerMessage.includes('when is my next') || lowerMessage.includes('upcoming reminder')) {
    if (nextReminder) {
      responseText = `Your next reminder is for ${nextReminder.medicineName} (${nextReminder.dosage}) at ${nextReminder.time} (${nextReminder.foodInstruction}).\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    } else {
      responseText = 'You have no upcoming reminders scheduled.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Show today\'s medicines', 'Show pending medicines', 'What medicine should I take now?'];
  } else if (lowerMessage.includes('caretaker') || lowerMessage.includes('care giver') || lowerMessage.includes('supervisor') || lowerMessage.includes('who is my')) {
    if (caretaker) {
      responseText = `Your caretaker information:\n\nCaretaker Name: ${caretaker.caretakerName}\nContact: ${caretaker.caretakerContact}\n\nThey will be notified if you miss any critical doses.\n\n${DISCLAIMER}`;
    } else {
      responseText = 'No caretaker information has been configured yet. Please set up a caretaker in the Caretaker Alerts section.\n\n' + DISCLAIMER;
    }
    suggestedActions = ['Configure caretaker alerts', 'Show missed medicines', 'Show today\'s medicines'];
  } else if (lowerMessage.includes('medicine history') || lowerMessage.includes('history') || lowerMessage.includes('previously taken')) {
    const historyList = [...takenReminders, ...missedReminders, ...pendingReminders].map(r => `• ${r.medicineName} - ${r.time} - ${r.status}`).join('\n');
    responseText = `Here is your medicine history:\n\n${historyList || 'No history available.'}\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    suggestedActions = ['Show today\'s medicines', 'Show missed medicines', 'Show pending medicines'];
  } else if (lowerMessage.includes('alert') || lowerMessage.includes('notification') || lowerMessage.includes('missed alert')) {
    if (alerts.length === 0) {
      responseText = 'You have no active alerts.\n\n' + DISCLAIMER;
    } else {
      const list = alerts.slice(0, 5).map(a => `• ${a.message}`).join('\n');
      responseText = `Recent alerts:\n\n${list}\n\nPlease follow your doctor's prescription. I do not provide medical advice.`;
    }
    suggestedActions = ['Show missed medicines', 'Show caretaker details', 'Show today\'s medicines'];
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
    responseText = `${getGreeting()}! I am your AI medication reminder assistant. How can I help you today?\n\n${DISCLAIMER}`;
    suggestedActions = ['What medicine should I take now?', 'Show today\'s medicines', 'Show my caretaker details'];
  } else if (lowerMessage.includes('thank')) {
    responseText = 'You are welcome! Remember to take your medicines on time. Stay healthy!\n\n' + DISCLAIMER;
    suggestedActions = ['Show today\'s medicines', 'What medicine should I take now?'];
  } else {
    responseText = 'I am your AI medication reminder assistant. I can help you with your medicine schedule, reminders, and caretaker information.\n\n' + DISCLAIMER;
    suggestedActions = [
      'What medicine should I take now?',
      'Show today\'s medicines',
      'Show pending medicines',
      'Show missed medicines',
      'Show my caretaker details',
    ];
  }

  return {
    id: generateId(),
    role: 'assistant',
    content: responseText,
    timestamp: Date.now(),
    suggestedActions,
  };
}

export async function sendMessage(userMessage: string): Promise<ChatMessage> {
  const userMsg: ChatMessage = {
    id: generateId(),
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
  };

  const history = loadChatHistory();
  history.push(userMsg);

  const assistantMsg = await processUserMessage(userMessage);
  history.push(assistantMsg);

  saveChatHistory(history);
  return assistantMsg;
}

export function getChatHistory(): ChatMessage[] {
  return loadChatHistory();
}

export function clearChatHistory(): void {
  localStorage.removeItem(CHAT_HISTORY_KEY);
}

export function getSuggestedPrompts(): string[] {
  return [
    'What medicine should I take now?',
    'Show today\'s medicines',
    'Show pending medicines',
    'Show missed medicines',
    'Show my prescription',
    'Show upcoming reminders',
    'Show medicine history',
    'Show caretaker details',
    'Tell me about Paracetamol',
    'Show side effects of Cetirizine',
    'What should I eat with this medicine?',
  ];
}
