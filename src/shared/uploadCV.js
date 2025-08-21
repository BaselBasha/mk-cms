import { ENDPOINTS } from './endpoints';

export async function uploadCV(cvFile, jobId, applicantName, language = 'en') {
  if (!cvFile || !jobId || !applicantName) {
    throw new Error('CV file, job ID, and applicant name are required');
  }

  if (!(cvFile instanceof File)) {
    throw new Error('Invalid file object');
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(cvFile.type)) {
    throw new Error('Only PDF, DOC, and DOCX files are allowed for CV uploads');
  }

  // Validate file size (10MB limit)
  if (cvFile.size > 10 * 1024 * 1024) {
    throw new Error('CV file size must be less than 10MB');
  }

  // First upload the CV file using the existing upload endpoint
  const formData = new FormData();
  formData.append('file', cvFile);
  
  try {
    const uploadRes = await fetch(ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Upload response not ok:', uploadRes.status, errorText);
      throw new Error(`CV upload failed: ${uploadRes.status} - ${errorText}`);
    }
    
    const uploadResult = await uploadRes.json();
    
    // Debug: Log the upload result to see the actual structure
    console.log('Upload result:', uploadResult);
    
    // Now create the candidate resume record with the uploaded CV
    const candidateData = {
      jobId: jobId,
      applicantName: applicantName,
      cvFile: {
        url: uploadResult.url,
        name: uploadResult.filename || uploadResult.originalName || cvFile.name,
        mimeType: uploadResult.mimeType,  // Use the mimeType from upload result
        size: uploadResult.size || cvFile.size
      }
    };
    
    // Debug: Log the exact data being sent
    console.log('Frontend - Upload result:', uploadResult);
    console.log('Frontend - CV file:', cvFile);
    console.log('Frontend - Candidate data being sent:', candidateData);
    console.log('Frontend - Language:', language);
    
    // Validate that we have all required fields
    if (!candidateData.cvFile.mimeType) {
      console.error('Missing mimeType in upload result:', uploadResult);
      throw new Error('Upload result missing mimeType field');
    }
    
    // Debug: Log the candidate data being sent
    console.log('Candidate data being sent:', candidateData);
    
    // Store the candidate resume data in MongoDB
    const candidateRes = await fetch(ENDPOINTS.candidates, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      body: JSON.stringify(candidateData),
    });
    
    if (!candidateRes.ok) {
      const errorText = await candidateRes.text();
      console.error('Candidate submission failed:', candidateRes.status, errorText);
      throw new Error(`Failed to store application: ${candidateRes.status} - ${errorText}`);
    }
    
    const candidateResult = await candidateRes.json();
    return candidateResult;
    
  } catch (error) {
    console.error('CV upload error:', error);
    throw error;
  }
}
