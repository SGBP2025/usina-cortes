# System Architecture - Usina de Cortes Virais

**Date:** 2026-03-12
**Version:** 2.0.0
**Project Type:** Web Application (Node.js/Express)

---

## Executive Summary

Usina de Cortes Virais is a web-based AI-powered video processing tool that automatically identifies and extracts viral moments from long-form videos for short-form content platforms (TikTok, Instagram Reels, YouTube Shorts). The system combines local FFmpeg processing with cloud-based AI APIs (OpenAI Whisper, Anthropic Claude Sonnet).

---

## Technology Stack

### Backend
- **Runtime:** Node.js (no version specified in package.json)
- **Framework:** Express 4.21.0
- **Dependencies:**
  - `multer` 1.4.5-lts.1 - File upload handling
  - `dotenv` 16.4.5 - Environment configuration

### Frontend
- **Pure HTML5/CSS3/JavaScript** (no framework)
- Single-page application in `public/index.html`

### External APIs
- **OpenAI Whisper API** - Audio transcription
- **Anthropic Claude Sonnet (v4)** - Viral moment selection and metadata generation

### Local Processing
- **FFmpeg** - Video/audio processing (auto-detected from multiple paths)
- **FFprobe** - Video metadata extraction

---

## Project Structure

```
usina-cortes/
├── node_modules/           # Dependencies
├── public/                 # Static assets (frontend)
│   └── index.html         # Single-page application (463 lines)
├── uploads/               # Temporary file storage for uploads
├── downloads/             # Generated video clips storage
├── docs/                  # Documentation (created for sale)
├── .env                   # Environment configuration (API keys, port)
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Dependency lock file
├── server.js              # Main application server (345 lines)
├── iniciar.bat            # Windows launcher script
└── setup.bat              # Initial setup script
```

---

## Architecture Overview

### Architecture Style
**Monolithic Web Application** - Single Express server handling all requests

### Request Flow
```
User Browser
    ↓ (HTTP POST /api/process)
Express Server (server.js)
    ↓ (SSE stream)
Client receives real-time progress updates
    ↓
Downloads completed clips
```

---

## Core Components

### 1. Express Server (`server.js`)

**Lines of Code:** 345
**Responsibilities:**
- File upload handling via Multer
- Video/audio processing orchestration
- AI API integration (Whisper, Claude)
- SSE (Server-Sent Events) for real-time progress
- Static file serving for downloads

**Key Sections:**
- Lines 12-24: FFmpeg auto-detection
- Lines 27-30: Multer upload configuration (2GB limit)
- Lines 43-96: Helper functions (env check, FFmpeg execution, audio extraction, clip cutting, duration detection)
- Lines 98-120: Whisper API integration
- Lines 122-187: Claude Sonnet API integration for viral moment selection
- Lines 193-195: SSE event helper
- Lines 201-314: Main processing pipeline route (`/api/process`)
- Lines 316-333: Clip management routes (`/api/clips` GET/DELETE)
- Lines 335-344: Server initialization

### 2. Frontend Application (`public/index.html`)

**Lines of Code:** 463
**Responsibilities:**
- Drag-and-drop file upload interface
- Real-time progress tracking via SSE
- Clip preview and download
- Video metadata display (timestamps, descriptions)
- Environment status checking

**Key UI Components:**
- Drop zone for video upload
- Progress bar with step indicators
- Clips grid (responsive, 9:16 aspect ratio)
- Error handling and status banners

### 3. Batch Scripts

**`iniciar.bat`:**
- Checks for `node_modules` (runs setup if missing)
- Validates `.env` existence
- Starts Node server in background
- Opens browser to http://localhost:3737
- Keeps console window open for server logs

**`setup.bat`:** (not reviewed in detail, but referenced in iniciar.bat)

---

## Data Flow

### Video Processing Pipeline

```
1. USER UPLOAD
   └─→ Multer saves to uploads/ (temp file)

2. AUDIO EXTRACTION (FFmpeg)
   └─→ Extract mono 16kHz WAV
   └─→ Save as [upload_path].wav

3. DURATION DETECTION (FFprobe)
   └─→ Get video duration in seconds

4. TRANSCRIPTION (OpenAI Whisper)
   └─→ Upload WAV to Whisper API
   └─→ Get full text + word-level timestamps
   └─→ Delete temporary WAV file

5. VIRAL MOMENT SELECTION (Claude Sonnet)
   └─→ Send transcription + timestamps to Claude
   └─→ Get JSON with 3-15 clip segments
   └─→ Each clip: start, end, platform-specific descriptions

6. CLIP CUTTING (FFmpeg)
   └─→ For each clip:
       ├─→ Extract segment from original video
       ├─→ Scale to even dimensions (trunc(iw/2)*2)
       ├─→ Encode H.264 (CRF 22, yuv420p)
       ├─→ Encode AAC (128kbps, 48kHz stereo)
       └─→ Add faststart flag

7. CLEANUP
   └─→ Delete original upload file
   └─→ Keep generated clips in downloads/
```

### Real-time Communication

**Server-Sent Events (SSE)**
- Client connects to `/api/process` via EventSource
- Server sends events:
  - `progress` - Step updates (1-5)
  - `clip_ready` - Individual clip completion
  - `done` - All clips complete
  - `error` - Processing failures
  - `ping` - Keepalive (every 15s)

---

## API Integration

### OpenAI Whisper API
- **Endpoint:** `https://api.openai.com/v1/audio/transcriptions`
- **Model:** `whisper-1`
- **Format:** `verbose_json` with `word` granularity
- **Authentication:** Bearer token from `OPENAI_API_KEY`

### Anthropic Claude Sonnet API
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Model:** `claude-sonnet-4-20250514`
- **Max Tokens:** 8192
- **Temperature:** 0.4
- **Authentication:** Bearer token from `ANTHROPIC_API_KEY`
- **Prompt Strategy:** Detailed contract for viral moment selection with strict timestamp requirements

---

## Configuration Management

### Environment Variables (`.env`)
```bash
PORT=3737                          # Server port
OPENAI_API_KEY=sk-proj-...         # Whisper API key
ANTHROPIC_API_KEY=sk-ant-...      # Claude Sonnet API key
UPLOAD_POST_TOKEN=eyJ...           # Upload-Post.com token (unused?)
```

### FFmpeg Auto-Detection
Priority order:
1. `process.env.FFMPEG_PATH`
2. `./ffmpeg/ffmpeg.exe`
3. `./ffmpeg/bin/ffmpeg.exe`
4. Hardcoded Windows path (developer's machine)
5. Fallback to system PATH

---

## Storage Strategy

### No Database
**Decision:** File-based storage only

**Rationale (Inferred):**
- Simplicity for single-user desktop application
- Stateless processing (each video processed independently)
- Clips stored as MP4 files for direct download
- No user accounts, authentication, or data persistence needed

**Implications:**
- No historical processing records
- No batch queue management
- Clips persist until manually deleted
- Not suitable for multi-user deployment without modification

### Directory Usage
- `uploads/` - Temporary storage (auto-deleted after processing)
- `downloads/` - Persistent storage for generated clips
- No backup or archival strategy

---

## Security Considerations

### Current Implementation
- No authentication/authorization
- No rate limiting
- No input validation beyond file type (video/*)
- API keys stored in `.env` (not in version control)
- No HTTPS enforcement
- File upload limit: 2GB via Multer

### Potential Vulnerabilities
- Unauthenticated API endpoints (anyone can process videos)
- API keys exposed if `.env` is committed
- No sanitization of video metadata
- No protection against malicious video files
- FFmpeg command injection risk (mitigated by using execFile with array args)

---

## Scalability Assessment

### Current Limitations
- **Concurrent Processing:** Not supported (single-threaded Express)
- **Queue Management:** No queue system
- **Resource Limits:** No CPU/RAM constraints
- **Storage:** Local filesystem only
- **Horizontal Scaling:** Not possible without architecture changes

### Scalability Bottlenecks
1. **FFmpeg Processing:** CPU-bound, blocks event loop
2. **API Rate Limits:** OpenAI/Anthropic have request limits
3. **Disk Space:** Temporary files accumulate
4. **Memory:** Large videos loaded into memory for upload

### Recommended Improvements (for Production)
- Implement job queue (Bull/Redis) for async processing
- Add horizontal scaling support (load balancer + worker nodes)
- Implement proper error handling and retry logic
- Add monitoring and logging
- Consider cloud storage (S3) for generated clips
- Add database for processing history and user management

---

## Dependencies Analysis

### Production Dependencies
```
express@4.21.0        - Web server (stable, widely used)
multer@1.4.5-lts.1    - File uploads (stable, LTS version)
dotenv@16.4.5         - Env vars (stable)
```

**Dependency Risk:** LOW
- All dependencies are mature and well-maintained
- No known critical vulnerabilities (as of analysis date)
- Minimal dependency tree reduces attack surface

### Runtime Requirements
- **Node.js:** No minimum version specified (recommend 18+)
- **FFmpeg:** Must be installed locally or bundled
- **OS:** Windows-focused (batch scripts), but Node.js is cross-platform

---

## Performance Characteristics

### Processing Time Estimate
For a 10-minute video:
1. Audio extraction: ~30s (depends on video duration)
2. Whisper transcription: ~60-120s (depends on audio length, API load)
3. Claude selection: ~10-20s (text length dependent)
4. Clip cutting: ~15-30s per clip (depends on duration, CPU)

**Total:** 3-5 minutes for 5 clips from 10-minute video

### Resource Usage
- **CPU:** High during FFmpeg operations
- **Memory:** Low (streaming uploads, not full file loading)
- **Disk:** 2x original video size during processing
- **Network:** Upload to Whisper API (audio only), small request to Claude

---

## Testing Status

**No test suite detected** (`package.json` has no test scripts)

**Implications for Sale:**
- No unit tests
- No integration tests
- No automated QA
- Manual testing only

---

## Documentation Status

**Current Documentation:**
- Minimal inline code comments (in Portuguese)
- No README file
- No API documentation
- No deployment guide
- No troubleshooting guide

**Documentation Created for Sale:**
This Brownfield Discovery assessment provides the first comprehensive technical documentation for the project.

---

## Known Issues & Limitations

### Identified Issues
1. **FFmpeg Path Hardcoded:** Contains developer-specific path (Windows-specific)
2. **Unused Variable:** `UPLOAD_POST_TOKEN` defined but not used in code
3. **SSE Event Type Parsing:** Complex workaround for event type detection (lines 391-418)
4. **No Error Recovery:** Processing failure results in data loss
5. **No File Cleanup:** `downloads/` never auto-cleared

### Limitations
- Single-user application design
- No batch processing
- No custom output format options
- Fixed video encoding parameters (CRF 22, H.264)
- No subtitle or caption generation
- No platform-specific formatting (vertical crop, etc.)

---

## Deployment Considerations

### Current Deployment Model
**Local Desktop Application** - Intended for single-user setup on Windows machine

### Deployment for Sale
**Options:**
1. **Source Code Sale:** Buyer installs Node.js, FFmpeg, configures `.env`
2. **Containerized Sale:** Dockerfile provided, buyer runs container
3. **SaaS Model:** Requires architecture overhaul (multi-tenancy, database, auth)

### Recommended for Sale
**Option 1 (Source Code)** - Minimal changes required, maintain current architecture

**Requirements:**
- Add comprehensive README with setup instructions
- Create Dockerfile for cross-platform compatibility
- Document API key acquisition process
- Add troubleshooting section
- Provide sample video and expected output

---

## Technical Debt Summary

### High Priority
1. Add comprehensive error handling and logging
2. Implement proper FFmpeg path configuration (remove hardcoded paths)
3. Add input validation and sanitization
4. Create test suite (at least for core processing functions)

### Medium Priority
1. Remove unused `UPLOAD_POST_TOKEN` variable
2. Simplify SSE event parsing logic
3. Add file cleanup strategy for `downloads/`
4. Document all functions with JSDoc comments

### Low Priority
1. Add request cancellation support
2. Implement progress estimation
3. Add more output format options
4. Create CLI interface for automation

---

## Recommendations for Buyers

### For Individual Use
- **Ease of Setup:** 8/10 (requires Node.js, FFmpeg, API keys)
- **Learning Curve:** 4/10 (simple web interface, no coding required)
- **Maintenance:** 3/10 (API key management, FFmpeg updates)

### For Commercial Use
- **Investment Required:** HIGH (needs database, auth, scaling, testing)
- **Time to Production:** 2-3 months with dedicated developer
- **Recommended Modifications:**
  - Add user authentication
  - Implement database (PostgreSQL/MongoDB)
  - Add queue system for concurrent processing
  - Implement proper error handling and retry logic
  - Add comprehensive monitoring and logging
  - Create deployment infrastructure (Docker, CI/CD)
  - Write test suite (unit, integration, E2E)
  - Add rate limiting and abuse prevention
  - Implement backup and archival strategy

---

## Conclusion

Usina de Cortes Virais is a **well-architected prototype** demonstrating effective integration of local video processing with AI APIs. The code is clean, readable, and functional for single-user desktop use. However, significant investment is required for production deployment or multi-user commercial use.

**Strengths:**
- Clean, maintainable code structure
- Effective use of modern APIs (Whisper, Claude Sonnet)
- Good real-time UX (SSE progress updates)
- Simple, focused feature set

**Weaknesses:**
- No database or persistence layer
- No testing infrastructure
- Single-threaded processing limits concurrency
- Windows-specific deployment (batch scripts)
- Minimal documentation

**Verdict for Sale:**
**Ready for source code sale to individual users/hobbyists.** Requires substantial development effort for commercial production deployment.

---

**Document Version:** 1.0
**Author:** AIOS Architect Agent (@architect)
**Next Phase:** Data Engineering Assessment (Phase 2)
