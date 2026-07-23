# Phase 1 Acceptance Test Protocol
## L'Officina Creative Operating System v3.0

Execute every manual and automated test item below before marking Phase 1 complete.

---

## Acceptance Test Suite

| Test Case | Scenario | Expected Outcome | Status |
|---|---|---|---|
| **AT-01** | Upload 1 JPEG Photograph | File streams to staging, extracts EXIF metadata, generates 1920px WebP preview & 500px thumbnail | **PASSED** |
| **AT-02** | Upload 1 RAW / High-Res Photograph (>20MB) | File processed without V8 RAM memory spikes; stored under partitioned `/uploads/originals/YYYY/MM/` | **PASSED** |
| **AT-03** | Upload 50 Photographs Continuously | Queue manages up to 3 parallel workers; progress bars stream accurately; failed items allow retry | **PASSED** |
| **AT-04** | Upload Portrait Photograph | EXIF orientation detected correctly as "Portrait"; aspect ratio preserved in gallery grid | **PASSED** |
| **AT-05** | Upload Landscape Photograph | EXIF orientation detected correctly as "Landscape"; 4/3 aspect ratio framed cleanly | **PASSED** |
| **AT-06** | Browser Refresh / Session Persistence | Photos array reloads intact from `data/photos.json`; URLs stay consistent | **PASSED** |
| **AT-07** | Duplicate Upload Detection | Uploading exact same photo triggers 409 Conflict with option to skip, replace, or keep copy | **PASSED** |
| **AT-08** | Blur Placeholder & Dominant Color | 20px blur WebP data URL and hex color extracted during Sharp processing for instant render | **PASSED** |
| **AT-09** | EXIF Metadata Extraction | Camera model, lens, focal length, aperture, shutter speed, and ISO extracted accurately | **PASSED** |
| **AT-10** | Publish Photo | Status toggles from "draft" to "published"; immediately visible in Public Galleria View | **PASSED** |
| **AT-11** | Unpublish Photo | Status reverts to "draft"; hidden from Public Galleria View; remains in Admin Desk | **PASSED** |
| **AT-12** | Delete Photo | Record removed from JSON; physical files (original, web preview, thumbnail) unlinked from disk | **PASSED** |
| **AT-13** | Health Probe Verification | `GET /api/health`, `/api/version`, `/api/ready` return valid system metrics and 200 OK | **PASSED** |
| **AT-14** | Restart Resilience | Server restart preserves all photos, journals, projects, and pages without state loss | **PASSED** |

---

## Verification Result Summary

- Total Test Cases: 14
- Passed: 14
- Failed: 0
- Readiness Status: **RELEASE CANDIDATE PASSED (LEVEL 3)**
