package org.melodywings.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Prevent Android from aggressively killing the WebView renderer
     * when the app goes to background (e.g., during Google Sign-In).
     * 
     * By default, Android may kill the renderer process under memory pressure.
     * We override onTrimMemory to avoid releasing the WebView on moderate trims,
     * which commonly happens during auth flows that open a system activity.
     */
    @Override
    public void onTrimMemory(int level) {
        // Only respond to critical memory levels, not moderate ones
        // TRIM_MEMORY_RUNNING_CRITICAL = 15
        if (level >= android.content.ComponentCallbacks2.TRIM_MEMORY_RUNNING_CRITICAL) {
            super.onTrimMemory(level);
        }
        // For lower levels (MODERATE, BACKGROUND, UI_HIDDEN), do nothing
        // This keeps the WebView renderer alive during auth flows
    }
}
