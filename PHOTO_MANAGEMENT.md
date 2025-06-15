# Photo Management Guide

This guide explains how to add, edit, or remove photos from the On the Hill BJJ website using the modular photo management system.

## Overview

The website uses a centralized photo management system with three main components:

1. **`photos-data.yaml`** - Contains all photo information organized by sections
2. **`photo-gallery.js`** - JavaScript module that loads and displays photos
3. **`photo-gallery.css`** - Styles for the Instagram-style photo viewer

## Photo Organization Structure

Photos are organized by sections in the `photos-data.yaml` file:

```yaml
about:                    # About Us section
stories:                  # Success Stories section
  gabriel_gb:            # Individual story subsections
  young_talents:
athletes:                 # Athletes & Achievements section
  european_championship:  # Individual achievement subsections
  regional_championships:
  south_american_championship:
help:                     # How to Help section
  financial_donations:    # Individual help type subsections
  athlete_sponsorship:
  volunteering:
```

## How to Add New Photos

### Step 1: Add Photo Files

1. Place your new photo files in the `used_media/` folder
2. Use descriptive filenames (e.g., `NEW_CHAMPION_2025.jpeg`)
3. Supported formats: `.jpeg`, `.jpg`, `.png`, `.webp`

### Step 2: Update photos-data.yaml

Open `photos-data.yaml` and add your photo information:

#### For About Section:
```yaml
about:
  - src: "used_media/YOUR_NEW_PHOTO.jpeg"
    alt: "Descriptive text for the photo"
```

#### For Stories Section:
```yaml
stories:
  gabriel_gb:  # or young_talents
    - src: "used_media/YOUR_NEW_PHOTO.jpeg"
      alt: "Descriptive text for the photo"
```

#### For Athletes Section:
```yaml
athletes:
  european_championship:  # or regional_championships, south_american_championship
    - src: "used_media/YOUR_NEW_PHOTO.jpeg"
      alt: "Descriptive text for the photo"
```

#### For Help Section:
```yaml
help:
  financial_donations:  # or athlete_sponsorship, volunteering
    - src: "used_media/YOUR_NEW_PHOTO.jpeg"
      alt: "Descriptive text for the photo"
```

### Step 3: Test Your Changes

1. Open the website in a browser
2. Navigate to the section you updated
3. Click on the photos to test the Instagram-style viewer
4. Verify all photos load correctly and navigation works

## How to Edit Existing Photos

### Replace a Photo File:
1. Replace the file in `used_media/` with the same filename
2. No changes needed in `photos-data.yaml`
3. Refresh the website to see changes

### Change Photo Information:
1. Open `photos-data.yaml`
2. Find the photo entry you want to edit
3. Update the `src` path or `alt` text as needed
4. Save the file

### Reorder Photos:
1. Open `photos-data.yaml`
2. Cut and paste photo entries to reorder them
3. The first photo in each section becomes the main/cover photo

## How to Remove Photos

### Remove from YAML:
1. Open `photos-data.yaml`
2. Delete the photo entry (both `src` and `alt` lines)
3. Save the file

### Optional - Remove File:
1. Delete the photo file from `used_media/` folder
2. This step is optional but recommended for cleanup

## Adding New Sections or Subsections

### For New Story or Achievement Subsections:

1. **Add to photos-data.yaml:**
```yaml
stories:
  new_story_name:
    - src: "used_media/PHOTO1.jpeg"
      alt: "Description"
    - src: "used_media/PHOTO2.jpeg"
      alt: "Description"
```

2. **Update photo-gallery.js:**
   - Find the `populateStoryCards()` or `populateAthleteCards()` function
   - Add your new subsection key to the appropriate array:
```javascript
const storyKeys = ['gabriel_gb', 'young_talents', 'new_story_name'];
```

3. **Add corresponding HTML:**
   - Add a new story card in the HTML file with appropriate content

### For Completely New Sections:

1. **Add to photos-data.yaml:**
```yaml
new_section:
  - src: "used_media/PHOTO.jpeg"
    alt: "Description"
```

2. **Update photo-gallery.js:**
   - Add a new populate function (e.g., `populateNewSection()`)
   - Call it from the `populateGalleries()` method

3. **Add HTML structure:**
   - Create the corresponding HTML section with appropriate classes

## Best Practices

### Photo Guidelines:
- **File size:** Keep images under 2MB for faster loading
- **Resolution:** Use high-quality images (1920px+ width recommended)
- **Format:** JPEG for photos, PNG for graphics with transparency
- **Naming:** Use descriptive, consistent naming (e.g., `CHAMPIONSHIP_2025.jpeg`)

### Alt Text Guidelines:
- Be descriptive but concise
- Include relevant context (location, event, people)
- Avoid "image of" or "photo of" prefixes
- Example: "Gabriel GB celebrating European championship victory"

### Organization Tips:
- **First photo** in each section becomes the main/cover image
- **Order photos** chronologically or by importance
- **Group related photos** in the same subsection
- **Use consistent naming** for easier management

## Troubleshooting

### Photos Not Appearing:
1. Check file path in `photos-data.yaml` matches actual file location
2. Verify file extension matches (case-sensitive)
3. Check browser console for loading errors
4. Ensure photo files are properly uploaded

### Instagram Viewer Not Working:
1. Check that `photo-gallery.js` is loaded
2. Verify `photo-gallery.css` is included
3. Check browser console for JavaScript errors
4. Ensure YAML syntax is correct (proper indentation)

### YAML Syntax Issues:
- Use **2 spaces** for indentation (not tabs)
- Ensure **quotes** around file paths and alt text
- Check **colons and dashes** are properly placed
- Validate YAML syntax using online tools if needed

## File Structure Reference

```
onthehill_bjj/
├── photos-data.yaml          # Photo data configuration
├── photo-gallery.js          # Photo gallery functionality
├── photo-gallery.css         # Photo gallery styles
├── onthehillbjj.html         # Main website file
└── used_media/               # Photo storage folder
    ├── ____main_logo_on_the_hill.png
    ├── ____main_logo_totti.png
    ├── EURO_CAMPEAO_GB.jpeg
    ├── GRA_EQUIPE.jpeg
    └── ... (other photos)
```

## Quick Reference Commands

### Add a new photo to About section:
```yaml
# In photos-data.yaml
about:
  # ...existing photos...
  - src: "used_media/NEW_PHOTO.jpeg"
    alt: "New photo description"
```

### Add a new photo to Gabriel's story:
```yaml
# In photos-data.yaml
stories:
  gabriel_gb:
    # ...existing photos...
    - src: "used_media/GB_NEW_VICTORY.jpeg"
      alt: "Gabriel's latest competition victory"
```

### Test your changes:
1. Save `photos-data.yaml`
2. Refresh the website
3. Navigate to the updated section
4. Click photos to test the viewer

---

**Need Help?** If you encounter issues or need to add complex new sections, consult the developer or refer to the main project documentation.
