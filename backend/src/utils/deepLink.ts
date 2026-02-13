/**
 * Handles deep linking and app installation redirection
 * @param contentId ID of the content (stream or video)
 * @param shareId ID of the social share record
 */
export const handleDeepLink = (contentId: string, shareId: string) => {
    const platform = detectPlatform();
    const iosAppStore = 'https://apps.apple.com/app/CY-live/id644'; // Replace with real ID
    const androidPlayStore = 'https://play.google.com/store/apps/details?id=com.cylive';

    if (platform === 'ios') {
        window.location.href = `cylive://open/${contentId}/${shareId}`;
        setTimeout(() => {
            window.location.href = iosAppStore;
        }, 2000);
    } else if (platform === 'android') {
        window.location.href = `cylive://open/${contentId}/${shareId}`;
        setTimeout(() => {
            window.location.href = androidPlayStore;
        }, 2000);
    } else {
        // Desktop/Other: Redirect to web player
        window.location.href = `https://cy.live/watch/${contentId}`;
    }
};

const detectPlatform = (): 'ios' | 'android' | 'desktop' => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return 'ios';
    if (/android/i.test(userAgent)) return 'android';
    return 'desktop';
};
