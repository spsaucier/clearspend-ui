import { join } from '_common/utils/join';

import css from './ReviewingImage.css';

interface ReviewingImageProps {
  class?: string;
}

export function ReviewingImage(props: Readonly<ReviewingImageProps>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" class={join(css.root, props.class)}>
      {/* background */}
      <path fill="#02302f" d="M0 0h600v600H0z" />
      {/* background lines */}
      <g>
        <g class={css.lines0}>
          <linearGradient
            id="reviewing-image-2"
            x1="281.12"
            x2="192.06"
            y1="-467.97"
            y2="-437.03"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#43fa76" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-2)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m177.3 448.2 55 31.7c1.4.8 1.3 2.8-.1 3.5l-35.9 19.1c-1.4.8-1.4 2.8 0 3.5l74 39.3c.6.3 1.3.3 1.9 0l146.4-84.5c1.3-.8 1.3-2.7 0-3.5l-81.1-46.8"
          />
          <linearGradient
            id="reviewing-image-4"
            x1="430.24"
            x2="474.77"
            y1="-275.3"
            y2="-252.66"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#43fa76" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-4)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m497.4 240.7-75.6 43.4"
          />
          <linearGradient
            id="reviewing-image-5"
            x1="365.33"
            x2="409.86"
            y1="-245.11"
            y2="-222.47"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#43fa76" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-5)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m432.5 210.5-75.6 43.4"
          />
          <linearGradient
            id="reviewing-image-7"
            x1="243.72"
            x2="185.6"
            y1="-274.93"
            y2="-230.39"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#43fa76" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-7)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m158.5 219.7 80 45.3"
          />
        </g>
        <g class={css.lines1}>
          <linearGradient
            id="reviewing-image-3"
            x1="502.15"
            x2="407.79"
            y1="-344.76"
            y2="-448.16"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#afffc6" />
            <stop offset="1" stop-color="#afffc6" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-3)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m421.7 502.4 74.4-42.9c1.4-.8 1.3-2.7 0-3.5L425 417.4c-1.4-.8-1.4-2.8 0-3.5l34.5-18.8c.6-.3 1.4-.3 2 0l36.7 21.2c.6.4 1.4.4 2 0l69-42.4c1.3-.8 1.3-2.7 0-3.4l-108.8-62.9c-.6-.4-1.4-.4-2 0l-36.6 21.1"
          />
          <linearGradient
            id="reviewing-image-6"
            x1="165.9"
            x2="138.73"
            y1="-359.34"
            y2="-317.07"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#afffc6" />
            <stop offset="1" stop-color="#afffc6" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-6)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m121 284.8 72.2 41.7c1.3.8 1.3 2.7 0 3.5L124 370c-1.3.8-1.3 2.7 0 3.5l33.6 19.4c.6.4 1.4.4 2.1 0l47.8-29.7"
          />
        </g>
        <g class={css.lines2}>
          <linearGradient
            id="reviewing-image-1"
            x1="258.08"
            x2="138.06"
            y1="-412.17"
            y2="-448.4"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#afffc6" />
            <stop offset="1" stop-color="#afffc6" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-1)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m121 459 74.2-42.8c.6-.4 1.4-.4 2 0l37.2 21.5c.6.4 1.4.4 2.1 0l43.8-27.2"
          />
          <linearGradient
            id="reviewing-image-8"
            x1="177.16"
            x2="56.39"
            y1="-400.85"
            y2="-327.63"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#afffc6" />
            <stop offset="1" stop-color="#afffc6" stop-opacity="0" />
          </linearGradient>
          <path
            fill="none"
            stroke="url(#reviewing-image-8)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m27 293.1 75.8 42c1.4.8 1.4 2.7 0 3.5l-54.1 31.2c-1.3.8-1.3 2.7 0 3.5l71.2 41.1c.6.4 1.4.4 2 0l15.3-8.8c.6-.4 1.4-.4 2 0l15.8 8.8c.6.3 1.4.3 2 0l60.1-35.6"
          />
        </g>
      </g>
      {/* background dots */}
      <g>
        <path
          fill="#335c5c"
          d="m379.8 199.4 4.3-2.3c.2-.1.4-.2.6-.2.2 0 .4.1.6.2l4.3 2.3c.1.1.2.1.2.2.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.1.2-.2.2l-4.4 2.3c-.2.1-.4.1-.6.1-.2 0-.4 0-.6-.1l-4.4-2.3c-.1-.1-.2-.1-.2-.2-.1-.1-.1-.2-.1-.3 0-.1 0-.2.1-.3.2-.1.3-.2.4-.2z"
        />
        <path
          fill="#43fa76"
          d="m390.6 506.2 7.4-4c.3-.2.7-.3 1.1-.3s.7.1 1.1.3l7.4 4c.2.1.3.2.4.4.1.2.2.4.2.6 0 .2-.1.4-.2.6-.1.2-.2.3-.4.4l-7.5 4.1c-.3.2-.6.2-1 .2s-.7-.1-1-.2l-7.5-4.1c-.2-.1-.3-.2-.4-.4-.1-.2-.2-.4-.2-.6 0-.2.1-.4.2-.6s.3-.3.4-.4zM112.9 415.6l7.4-4c.3-.2.7-.3 1.1-.3.4 0 .7.1 1.1.3l7.4 4c.2.1.3.2.4.4s.2.4.2.6-.1.4-.2.6c-.1.2-.3.3-.4.4l-7.5 4.1c-.3.2-.6.2-1 .2-.3 0-.7-.1-1-.2l-7.5-4.1c-.2-.1-.3-.2-.4-.4-.1-.2-.2-.4-.2-.6s.1-.4.2-.6c.1-.2.2-.3.4-.4zM511.4 343.1l7.4-4c.3-.2.7-.3 1.1-.3.4 0 .7.1 1.1.3l7.4 4c.2.1.3.2.4.4s.2.4.2.6c0 .2-.1.4-.2.6-.1.2-.3.3-.4.4l-7.5 4.1c-.3.2-.6.2-1 .2-.3 0-.7-.1-1-.2l-7.5-4.1c-.2-.1-.3-.2-.4-.4-.1-.2-.2-.4-.2-.6 0-.2.1-.4.2-.6.1-.1.2-.3.4-.4zM146.1 495.6l7.4-4c.3-.2.7-.3 1.1-.3.4 0 .7.1 1.1.3l7.4 4c.2.1.3.2.4.4s.2.4.2.6-.1.4-.2.6-.3.3-.4.4l-7.5 4.1c-.3.2-.6.2-1 .2-.3 0-.7-.1-1-.2l-7.5-4.1c-.2-.1-.3-.2-.4-.4-.1-.2-.2-.4-.2-.6s.1-.4.2-.6c.1-.2.2-.3.4-.4z"
        />
        <path
          fill="#335c5c"
          d="m509.7 283.9 4.3-2.3c.2-.1.4-.2.6-.2.2 0 .4.1.6.2l4.3 2.3c.1.1.2.1.2.2.1.1.1.2.1.3s0 .2-.1.3-.1.2-.2.2l-4.4 2.3c-.2.1-.4.1-.6.1-.2 0-.4 0-.6-.1l-4.4-2.3c-.1-.1-.2-.1-.2-.2s-.1-.2-.1-.3 0-.2.1-.3c.2-.1.3-.1.4-.2zM39.2 369.1l10.5-5.8c.5-.2 1-.4 1.5-.4s1 .1 1.5.4l10.5 5.8c.3.1.5.3.6.6.1.2.2.5.2.8 0 .3-.1.5-.2.8-.1.2-.4.4-.6.6l-10.6 5.9c-.4.2-.9.3-1.4.3-.5 0-.9-.1-1.4-.3l-10.7-5.9a.9.9 0 0 1-.6-.6c-.1-.2-.2-.5-.2-.8 0-.3.1-.6.2-.8.2-.2.4-.4.7-.6z"
        />
        <path
          fill="#43fa76"
          d="m99 270.3 4.3-2.3c.2-.1.4-.2.6-.2.2 0 .4.1.6.2l4.3 2.3c.1.1.2.1.2.2.1.1.1.2.1.3s0 .2-.1.3-.1.2-.2.2l-4.4 2.3c-.2.1-.4.1-.6.1s-.4 0-.6-.1l-4.4-2.3c-.1-.1-.2-.1-.3-.2s-.1-.2-.1-.3 0-.2.1-.3c.4 0 .4-.1.5-.2z"
        />
      </g>
      <g>
        <path
          fill="#335c5c"
          d="m299.8 480.2 4.3-2.3c.2-.1.4-.2.6-.2.2 0 .4.1.6.2l4.3 2.3c.1.1.2.1.2.2.1.1.1.2.1.3s0 .2-.1.3-.1.2-.2.2l-4.4 2.3c-.2.1-.4.1-.6.1-.2 0-.4 0-.6-.1l-4.4-2.3c-.1-.1-.2-.1-.2-.2s-.1-.2-.1-.3 0-.2.1-.3c.2-.1.3-.2.4-.2z"
        />
      </g>
      {/* main items */}
      <g class={css.items}>
        <g>
          <linearGradient
            id="reviewing-image-9"
            x1="305.52"
            x2="305.52"
            y1="450.6"
            y2="359.56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#afffc6" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-9)"
            d="M438.6 359.6v.5-.5zm-8.5 16.6L319.6 440a27.78 27.78 0 0 1-28 0L181 376.2a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1-2.3-8.6c0-.6 0-1.2.1-1.7h-.2v6c0 2 .3 4.1 1 6 1.3 3.6 3.9 9.3 7.5 11.5l110.5 63.8a27.78 27.78 0 0 0 28 0L430 383.3c2.6-1.5 4.8-3.7 6.3-6.3 1.5-2.6 2.3-5.6 2.3-8.6v-5.8c-.2 2.6-1 5.1-2.3 7.4-1.4 2.5-3.6 4.7-6.2 6.2z"
          />
          <linearGradient
            id="reviewing-image-10"
            x1="223.89"
            x2="478.26"
            y1="-361.73"
            y2="-354.94"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#1a4747" />
            <stop offset="1" stop-color="#335c5c" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-10)"
            d="m181 346.4 109-62.9c4.7-2.7 10.1-4.2 15.5-4.2 5.5 0 10.8 1.4 15.5 4.2l109 62.9c2.6 1.5 4.8 3.7 6.3 6.3a17.3 17.3 0 0 1 0 17.2 17.3 17.3 0 0 1-6.3 6.3L319.6 440a27.78 27.78 0 0 1-28 0L181 376.2a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1 0-17.2c1.6-2.6 3.7-4.8 6.3-6.3z"
          />
        </g>
        <g>
          <linearGradient
            id="reviewing-image-11"
            x1="305.52"
            x2="305.52"
            y1="405.5"
            y2="314.38"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#43fa76" />
            <stop offset="1" stop-color="#afffc6" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-11)"
            d="M438.6 314.5v.4-.4zm-8.5 16.6-110.5 63.8a27.78 27.78 0 0 1-28 0L181 331.1a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1-2.3-8.6c0-.6 0-1.2.1-1.8h-.1v6c0 2.1.3 4.1 1 6 1.3 3.6 3.9 9.3 7.5 11.5l110.5 63.8a27.78 27.78 0 0 0 28 0L430 338.2c2.6-1.5 4.8-3.7 6.3-6.3 1.5-2.6 2.3-5.6 2.3-8.6v-5.9c-.2 2.6-1 5.1-2.3 7.4-1.4 2.6-3.6 4.8-6.2 6.3z"
          />
          <linearGradient
            id="reviewing-image-12"
            x1="235.77"
            x2="535.43"
            y1="-317.72"
            y2="-303.38"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#1a4747" />
            <stop offset="1" stop-color="#335c5c" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-12)"
            d="m181 301.2 109-62.9c4.7-2.7 10.1-4.2 15.5-4.2s10.8 1.4 15.5 4.2l109 62.9c2.6 1.5 4.8 3.7 6.3 6.3a17.3 17.3 0 0 1 0 17.2 17.3 17.3 0 0 1-6.3 6.3l-110.5 63.8a27.78 27.78 0 0 1-28 0L181 331.1a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1 6.3-23.6z"
          />
        </g>
        <g>
          <linearGradient
            id="reviewing-image-13"
            x1="297.23"
            x2="342.43"
            y1="309.06"
            y2="300.77"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#033" />
            <stop offset="1" stop-color="#335c5c" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-13)"
            d="M438.6 274.1v.4-.4zm-8.5 16.5-110.5 63.8a27.78 27.78 0 0 1-28 0L181 290.6a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1-2.3-8.6c0-.6 0-1.2.1-1.8h-.1v6c0 2.1.3 4.1 1 6 1.3 3.6 3.9 9.3 7.5 11.5l110.5 63.8a27.78 27.78 0 0 0 28 0L430 297.7c2.6-1.5 4.8-3.7 6.3-6.3 1.5-2.6 2.3-5.6 2.3-8.6v-5.9c-.2 2.6-1 5.1-2.3 7.4-1.4 2.6-3.6 4.8-6.2 6.3z"
          />
          <linearGradient
            id="reviewing-image-14"
            x1="402.75"
            x2="250.28"
            y1="-170.74"
            y2="-332.27"
            gradientTransform="matrix(1 0 0 -1 0 2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#afffc6" />
            <stop offset="1" stop-color="#43fa76" />
          </linearGradient>
          <path
            fill="url(#reviewing-image-14)"
            d="m181 260.8 109-62.9c4.7-2.7 10.1-4.2 15.5-4.2s10.8 1.4 15.5 4.2l109 62.9c2.6 1.5 4.8 3.7 6.3 6.3a17.3 17.3 0 0 1 0 17.2 17.3 17.3 0 0 1-6.3 6.3l-110.5 63.8a27.78 27.78 0 0 1-28 0L181 290.6a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1 0-17.2c1.5-2.6 3.7-4.8 6.3-6.3z"
          />
        </g>
      </g>
      {/* top item [copy] */}
      <g class={css.top}>
        <linearGradient
          id="reviewing-image-13"
          x1="297.23"
          x2="342.43"
          y1="309.06"
          y2="300.77"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#033" />
          <stop offset="1" stop-color="#335c5c" />
        </linearGradient>
        <path
          fill="url(#reviewing-image-13)"
          d="M438.6 274.1v.4-.4zm-8.5 16.5-110.5 63.8a27.78 27.78 0 0 1-28 0L181 290.6a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1-2.3-8.6c0-.6 0-1.2.1-1.8h-.1v6c0 2.1.3 4.1 1 6 1.3 3.6 3.9 9.3 7.5 11.5l110.5 63.8a27.78 27.78 0 0 0 28 0L430 297.7c2.6-1.5 4.8-3.7 6.3-6.3 1.5-2.6 2.3-5.6 2.3-8.6v-5.9c-.2 2.6-1 5.1-2.3 7.4-1.4 2.6-3.6 4.8-6.2 6.3z"
        />
        <linearGradient
          id="reviewing-image-14"
          x1="402.75"
          x2="250.28"
          y1="-170.74"
          y2="-332.27"
          gradientTransform="matrix(1 0 0 -1 0 2)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#afffc6" />
          <stop offset="1" stop-color="#43fa76" />
        </linearGradient>
        <path
          fill="url(#reviewing-image-14)"
          d="m181 260.8 109-62.9c4.7-2.7 10.1-4.2 15.5-4.2s10.8 1.4 15.5 4.2l109 62.9c2.6 1.5 4.8 3.7 6.3 6.3a17.3 17.3 0 0 1 0 17.2 17.3 17.3 0 0 1-6.3 6.3l-110.5 63.8a27.78 27.78 0 0 1-28 0L181 290.6a17.3 17.3 0 0 1-6.3-6.3 17.3 17.3 0 0 1 0-17.2c1.5-2.6 3.7-4.8 6.3-6.3z"
        />
        <path
          fill="#033"
          d="M310.9 256a9.5 9.5 0 0 0-5.2-1.2L238.6 265c-3.3.5-4.2 2-1.8 3.4l14.8 8.6 68.6-15.6-9.3-5.4zm53 17.8-8-4.6-37.7 16.1 11.8 6.8c.9.5 1.9.9 2.9 1 1 .1 2.1-.1 3-.4l29.2-16.9c.6-.4 0-1.3-1.2-2zm-20.8-12c-1.2-.7-2.5-1-3.9-.9L260.4 282l14.8 8.6c2.8 1.4 6 1.6 8.9.7l67-24.8-8-4.7z"
        />
      </g>
      {/* light */}
      <linearGradient
        id="reviewing-image-15"
        x1="305.11"
        x2="305.11"
        y1="-363"
        y2="-68.3"
        gradientTransform="matrix(1 0 0 -1 0 2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#43fa76" stop-opacity=".4" />
        <stop offset=".25" stop-color="#43fa76" stop-opacity=".2" />
        <stop offset="1" stop-color="#43fa76" stop-opacity="0" />
      </linearGradient>
      <path
        fill="url(#reviewing-image-15)"
        d="M172 62v217.6c0 2.1.3 4.1 1 6 1.3 3.6 3.9 9.3 7.5 11.5L291 360.9a27.78 27.78 0 0 0 28 0l110.5-63.6c2.6-1.5 4.8-3.7 6.3-6.3 1.5-2.6 2.3-5.6 2.3-8.6V62H172z"
      />
    </svg>
  );
}
