import { createRequestSender } from '@bigcommerce/request-sender';

import { parseUrl } from '../common/url';

import EmbeddedCheckout from './embedded-checkout';
import { EmbeddedCheckoutEventMap } from './embedded-checkout-events';
import EmbeddedCheckoutOptions from './embedded-checkout-options';
import { EmbeddedContentEvent } from './iframe-content/embedded-content-events';
import IframeEventListener from './iframe-event-listener';
import IframeEventPoster from './iframe-event-poster';
import LoadingIndicator from './loading-indicator';
import ResizableIframeCreator from './resizable-iframe-creator';

/**
 * Embed the checkout form in an iframe.
 *
 * @remarks
 * Once the iframe is embedded, it will automatically resize according to the
 * size of the checkout form. It will also notify the parent window when certain
 * events have occurred. i.e.: when the form is loaded and ready to be used.
 *
 * ```js
 * embedCheckout({
 *     url: 'https://checkout/url',
 *     containerId: 'container-id',
 * });
 * ```
 *
 * @alpha
 * Please note that this feature is currently in an early stage of development.
 * Therefore the API is unstable and not ready for public consumption.
 *
 * @param options - Options for embedding the checkout form.
 * @returns A promise that resolves to an instance of `EmbeddedCheckout`.
 */
export default function embedCheckout(options: EmbeddedCheckoutOptions): Promise<EmbeddedCheckout> {
    const origin = parseUrl(options.url).origin;
    const embeddedCheckout = new EmbeddedCheckout(
        new ResizableIframeCreator(),
        new IframeEventListener<EmbeddedCheckoutEventMap>(origin),
        new IframeEventPoster<EmbeddedContentEvent>(origin),
        new LoadingIndicator({ styles: options.styles && options.styles.loadingIndicator }),
        createRequestSender(),
        options
    );

    return embeddedCheckout.attach();
}
