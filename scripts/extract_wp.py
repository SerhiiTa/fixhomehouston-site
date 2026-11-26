"""Extract pages/posts from a WordPress WXR export into content/pages.json.
Usage: python3 scripts/extract_wp.py export.xml content/pages.json
"""
import re, sys, json, html
from html.parser import HTMLParser

SRC, OUT = sys.argv[1], sys.argv[2]
s = open(SRC, encoding='utf-8', errors='replace').read()
items = re.findall(r'<item>(.*?)</item>', s, re.S)

def g(it, tag):
    m = re.search(r'<%s>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</%s>' % (tag, tag), it, re.S)
    return m.group(1) if m else ''

def metas(it):
    return dict(re.findall(r'<wp:meta_key><!\[CDATA\[(.*?)\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>', it, re.S))

ALLOWED = {'h1','h2','h3','h4','p','ul','ol','li','strong','em','b','i','a','img','br','table','thead','tbody','tr','td','th','details','summary','div','figure','figcaption','blockquote'}
VOID = {'img', 'br'}

class San(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.stack = []
    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED:
            return
        a = dict(attrs)
        keep = ''
        if tag == 'a' and a.get('href'):
            keep = ' href="%s"' % rel(a['href'])
        if tag == 'img':
            src = a.get('src') or a.get('data-src') or ''
            if not src:
                return
            keep = ' src="%s" alt="%s" loading="lazy"' % (rel(src), html.escape(a.get('alt', ''), quote=True))
        if tag == 'div':
            return  # flatten wrappers
        self.out.append('<%s%s>' % (tag, keep))
        if tag not in VOID:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag not in ALLOWED or tag in VOID or tag == 'div':
            return
        if tag in self.stack:
            while self.stack:
                t = self.stack.pop()
                self.out.append('</%s>' % t)
                if t == tag:
                    break
    def handle_data(self, d):
        self.out.append(html.escape(d, quote=False))

def rel(u):
    u = html.unescape(u)
    u = re.sub(r'^https?://(www\.)?fixhomehouston\.com', '', u)
    return html.escape(u, quote=True)

def faq_blocks(c):
    def rep(m):
        try:
            d = json.loads(m.group(1))
        except Exception:
            return ''
        q = re.sub(r'<[^>]+>', '', d.get('question', '')).strip()
        a = d.get('answer', '')
        return '<details><summary>%s</summary><p>%s</p></details>' % (html.escape(q), a)
    return re.sub(r'<!-- wp:uagb/faq-child (\{.*?\}) /-->', rep, c, flags=re.S)

def clean(c):
    c = faq_blocks(c)
    c = re.sub(r'<!-- wp:block \{[^}]*\} /-->', '', c)
    c = re.sub(r'<!--.*?-->', '', c, flags=re.S)
    c = re.sub(r'<(script|style|svg|form|iframe|button|input|textarea|select).*?</\1>', '', c, flags=re.S)
    c = re.sub(r'\[(/?expand[^\]]*)\]', '', c)
    c = re.sub(r'\[(contact-form-7|trustindex|wpseo_breadcrumb|category_tags|pt_view|vc_|/vc_)[^\]]*\]', '', c)
    p = San(); p.feed(c); p.close()
    while p.stack:
        p.out.append('</%s>' % p.stack.pop())
    o = ''.join(p.out)
    o = re.sub(r'<(p|h[1-4]|li|strong|em|b|i|a)>(\s|&nbsp;|<br>)*</\1>', '', o)
    o = re.sub(r'(<(p|h[1-4]|li|strong|em|b|i|a)>(\s|&nbsp;|<br>)*</\2>)', '', o)
    return o.strip()

SITE = 'Houston Home Fix'
def rename(x):
    x = re.sub(r'houston appliance fix', SITE, x, flags=re.I)
    # template fragments that depended on widgets/forms the new site renders itself
    junk = [
        r'<h2>Discount Coupon</h2>', r'<p>Discount Coupon</p>', r'<p>\$25 OFF</p>', r'<h2>\$25 OFF</h2>',
        r'<p>On [A-Za-z ]+(Service|Repair)\s*</p>', r'<strong>Coupon applied</strong>',
        r'<p>Pick the Appliance Requiring Service or Repair:</p>',
        r'<h2>Request Service</h2>(<p>(Call us to describe[^<]*|Find Out the Cost to Repair Your Appliance|Give us a call to discuss[^<]*)</p>)?',
        r'<h2>Request A Quote</h2>', r'<h2>Honest Reviews</h2>(<p>Reviews of Our Service</p>)?',
        r'<h2>Testimonials</h2>(<p>[^<]*</p>)?',
    ]
    for j in junk:
        x = re.sub(j, '', x, flags=re.I)
    # the old coupon widget (image + link) becomes a simple coupon card styled by the new theme
    coupon = '<aside class="coupon"><b>$25 OFF</b><span>On appliance repair service</span><a href="/coupon/">Use coupon</a></aside>'
    x = re.sub(r'<figure>\s*<img[^>]*coupon[^>]*>\s*</figure>\s*<a href="/coupon/">\s*USE COUPON\s*</a>', coupon, x, flags=re.I)
    x = re.sub(r'<a href="/coupon/">\s*USE COUPON\s*</a>', coupon, x, flags=re.I)
    return x
def resolve(t, title):
    t = html.unescape(t)
    t = t.replace('%title%', title).replace('%sitename%', SITE).replace('%sep%', '-').replace('%sitedesc%', '')
    return re.sub(r'\s+', ' ', t).strip()

pages = []
for it in items:
    t = g(it, 'wp:post_type')
    if t not in ('page', 'post') or g(it, 'wp:status') != 'publish':
        continue
    if g(it, 'wp:post_name') in ('sample-page',):
        continue
    m = metas(it)
    title = html.unescape(g(it, 'title')).strip()
    link = g(it, 'link').replace('https://fixhomehouston.com', '') or '/'
    raw = g(it, 'content:encoded')
    h1m = re.search(r'<h1[^>]*>(.*?)</h1>', raw, re.S)
    seo_title = resolve(m.get('rank_math_title', '') or m.get('_yoast_wpseo_title', '') or title, title)
    desc = resolve(m.get('rank_math_description', '') or m.get('_yoast_wpseo_metadesc', ''), title)
    desc = re.sub(r'free house[- ]call( with repair)?', '$65 diagnostic applied to repair', desc, flags=re.I)
    thumb_id = m.get('_thumbnail_id', '')
    pages.append(dict(
        type=t, slug=g(it, 'wp:post_name'), path=link, title=title, seoTitle=seo_title, description=desc,
        h1=re.sub(r'<[^>]+>', '', html.unescape(h1m.group(1))).strip() if h1m else '',
        date=g(it, 'wp:post_date')[:10], modified=g(it, 'wp:post_modified')[:10],
        thumb=thumb_id, body=rename(clean(raw))))

# thumbnails
att = {}
for it in items:
    if g(it, 'wp:post_type') == 'attachment':
        att[g(it, 'wp:post_id')] = rel(g(it, 'wp:attachment_url'))
for p in pages:
    p['thumb'] = att.get(p['thumb'], '')

json.dump(pages, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(pages), 'pages')
