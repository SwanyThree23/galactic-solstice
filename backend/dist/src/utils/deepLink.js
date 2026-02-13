"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeepLink = void 0;
/**
 * Handles deep linking and app installation redirection
 * @param contentId ID of the content (stream or video)
 * @param shareId ID of the social share record
 */
const handleDeepLink = (contentId, shareId) => {
    const platform = detectPlatform();
    const iosAppStore = 'https://apps.apple.com/app/CY-live/id644'; // Replace with real ID
    const androidPlayStore = 'https://play.google.com/store/apps/details?id=com.cylive';
    if (platform === 'ios') {
        window.location.href = `cylive://open/${contentId}/${shareId}`;
        setTimeout(() => {
            window.location.href = iosAppStore;
        }, 2000);
    }
    else if (platform === 'android') {
        window.location.href = `cylive://open/${contentId}/${shareId}`;
        setTimeout(() => {
            window.location.href = androidPlayStore;
        }, 2000);
    }
    else {
        // Desktop/Other: Redirect to web player
        window.location.href = `https://cy.live/watch/${contentId}`;
    }
};
exports.handleDeepLink = handleDeepLink;
const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
        return 'ios';
    if (/android/i.test(userAgent))
        return 'android';
    return 'desktop';
};
