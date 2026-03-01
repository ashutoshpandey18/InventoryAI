# Public Assets

## Background Video for Hero Section

### Required Video Files

Place the following video files in this directory (`/public`):

1. **hero-background.mp4** - Main video file (H.264 codec)
2. **hero-background.webm** - WebM format for better browser support

### Video Specifications

**Recommended Settings:**

- **Resolution**: 1920x1080 (Full HD) or 2560x1440 (2K)
- **Duration**: 10-30 seconds (will loop)
- **Format**: MP4 (H.264) + WebM (VP9)
- **File Size**: Under 5MB for optimal performance
- **Frame Rate**: 24-30 FPS
- **Aspect Ratio**: 16:9

### Recommended Video Style

For the best effect with your dark hero section:

1. **Dark, atmospheric footage**:
   - Slow-moving clouds
   - Nebula/space-like abstract visuals
   - Gentle particle effects
   - Gradient color shifts (blues, purples, indigos)

2. **Motion characteristics**:
   - Slow, subtle movement
   - No jarring cuts or fast motion
   - Smooth, continuous flow
   - Minimal contrast changes

### Where to Find Videos

**Free Stock Video Sources:**

- [Pexels Videos](https://www.pexels.com/videos/) - Free, no attribution required
- [Pixabay Videos](https://pixabay.com/videos/) - Free stock videos
- [Videvo](https://www.videvo.net/) - Free HD stock footage
- [Coverr](https://coverr.co/) - Beautiful free videos

**Search Terms:**

- "dark clouds timelapse"
- "abstract particles dark"
- "nebula space background"
- "gradient motion background"
- "dark atmospheric loop"

### Video Optimization

To optimize your video for web:

```bash
# Using FFmpeg to compress MP4
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=1920:1080 -an hero-background.mp4

# Convert to WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -vf scale=1920:1080 -an hero-background.webm
```

### Fallback

If no video is available, the hero section will display:

- Animated gradient background (already implemented)
- Nebula float effects
- No video loading errors

The design gracefully degrades without video content.

---

## File Structure

```
public/
├── hero-background.mp4   (← place your video here)
├── hero-background.webm  (← place your video here)
└── VIDEO-INSTRUCTIONS.md (← this file)
```
