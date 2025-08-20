# Multilingual Support Implementation

This document describes the multilingual support implementation for the MK-CMS website, supporting Arabic (ar) and English (en) languages.

## Features

- **Language Switching**: Toggle between Arabic and English with a language switcher in the navbar
- **RTL Support**: Automatic right-to-left layout for Arabic text
- **Local Storage**: Language preference is saved in browser's local storage
- **Font Support**: Cairo font for Arabic text rendering
- **Complete Translation**: All UI text is translated to both languages

## Implementation Details

### 1. Language Context (`src/contexts/LanguageContext.js`)
- Manages current language state
- Handles RTL/LTR direction switching
- Persists language preference in localStorage
- Updates document direction and language attributes

### 2. Translations (`src/locales/translations.js`)
- Contains all text content in both languages
- Organized by sections (navigation, hero, about, products, etc.)
- Easy to maintain and extend

### 3. Language Switcher (`src/components/LanguageSwitcher.js`)
- Globe icon with language indicator (EN/AR)
- Positioned in the navbar for easy access
- Responsive design for mobile and desktop

### 4. RTL Support (`src/app/globals.css`)
- CSS rules for right-to-left layout
- Arabic font (Cairo) import
- RTL-specific spacing and text alignment adjustments

### 5. Integration
- All components use the `useLanguage` hook
- Text content dynamically updates based on selected language
- Document direction automatically switches between LTR and RTL

## Usage

### Switching Languages
1. Click the language switcher button in the navbar
2. Language automatically switches between English and Arabic
3. Preference is saved and restored on page reload

### Adding New Translations
1. Add new text keys to `src/locales/translations.js`
2. Use the `useLanguage` hook in your component
3. Access translations via `t.yourSection.yourKey`

### Example Component Usage
```jsx
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/locales/translations';

const MyComponent = () => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t.mySection.title}</h1>
      <p>{t.mySection.description}</p>
    </div>
  );
};
```

## Language-Specific Features

### Arabic (ar)
- Right-to-left (RTL) layout
- Cairo font family
- Arabic text content
- RTL-specific spacing adjustments

### English (en)
- Left-to-right (LTR) layout
- Default font family
- English text content
- Standard spacing

## Browser Support
- Modern browsers with localStorage support
- RTL layout support
- CSS custom properties support

## Future Enhancements
- Add more languages
- Implement server-side language detection
- Add language-specific content (images, videos)
- Implement language-specific SEO meta tags

