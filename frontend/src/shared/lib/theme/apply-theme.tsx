import { headers } from 'next/headers';

export const ApplyTheme = async () => {
  const h = await headers();
  const theme = h.get('x-theme');
  return (
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                document.documentElement.setAttribute('data-theme', '${theme}');
              })();
            `,
        }}
      />
    </head>
  );
};
