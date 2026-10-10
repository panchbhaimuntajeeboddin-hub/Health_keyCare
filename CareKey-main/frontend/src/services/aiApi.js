import { apiRequest } from './api';

export const aiApi = {
  /**
   * Real AI Chat request via Spring Boot Backend OpenRouter API integration
   * @param {string} question - User / Patient inquiry prompt
   * @returns {Promise<{ response: string, disclaimer: string }>}
   */
  async chat(question) {
    if (!question || !question.trim()) {
      throw new Error('Please enter a clinical inquiry or health question.');
    }

    const trimmed = question.trim();

    try {
      const result = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ question: trimmed })
      });

      if (result && result.error) {
        throw new Error(result.error);
      }
      if (result && (result.response || result.summary || result.explanation)) {
        return result;
      }
      return result;
    } catch (err) {
      console.error('AI chat backend error:', err.message);
      throw new Error(err.message || 'Unable to communicate with OpenRouter AI engine.');
    }
  },

  /**
   * Generate longitudinal AI Clinical Summary for treating physician
   */
  async generateClinicalSummary(patient = null, visits = [], prescriptions = [], medicalText = '') {
    try {
      const result = await apiRequest('/ai/clinical-summary', {
        method: 'POST',
        body: JSON.stringify({ 
          patientId: patient?.id || patient?.patientId, 
          patient, 
          visits, 
          prescriptions,
          medicalText
        })
      });

      if (result && result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (err) {
      console.error('AI Clinical Summary backend error:', err.message);
      throw new Error(err.message || 'Failed to generate clinical summary via OpenRouter.');
    }
  },

  /**
   * Generate patient-friendly explanation of clinical findings
   */
  async generatePatientExplanation(medicalText, context = '') {
    try {
      const result = await apiRequest('/ai/patient-explanation', {
        method: 'POST',
        body: JSON.stringify({ medicalText, context })
      });

      if (result && result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (err) {
      console.error('AI Patient Explanation backend error:', err.message);
      throw new Error(err.message || 'Failed to generate patient explanation.');
    }
  },

  /**
   * Query epidemiological public health assistant
   */
  async queryAdminAssistant(question, aggregateContext = {}) {
    try {
      const result = await apiRequest('/ai/admin-assistant', {
        method: 'POST',
        body: JSON.stringify({ question, aggregateContext })
      });

      if (result && result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (err) {
      console.error('AI Admin Assistant backend error:', err.message);
      throw new Error(err.message || 'Failed to query epidemiological AI assistant.');
    }
  }
};

