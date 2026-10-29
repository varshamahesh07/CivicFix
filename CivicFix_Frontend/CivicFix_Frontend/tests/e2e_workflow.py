"""CivicFix end-to-end workflow test (Playwright, Python).

Setup once:   pip install playwright && python -m playwright install chromium
Run:          npm run dev   (in one terminal, serving http://127.0.0.1:5173)
              python tests/e2e_workflow.py   (in another)

Covers the full citizen -> authority -> citizen lifecycle from the spec, validation,
privacy, pending-authority blocking, protected routes, responsive overflow, and console errors.
"""
import re, atexit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:5173'
problems = []      # console/page errors
def _print_results():
    print('\n=== RESULTS ===')
    for r in results:
        print(f'{r[0]:5} {r[1]}')
    print(f'\n=== CONSOLE/PAGE ERRORS: {len(problems)} ===')
    for pr in problems[:30]:
        print(pr)
atexit.register(_print_results)
results = []       # pass/fail log

def step(name, fn):
    try:
        fn()
        results.append(('PASS', name))
    except Exception as e:
        results.append(('FAIL', f'{name}: {str(e).splitlines()[0]}'))

def overflow(page):
    return page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    page = ctx.new_page()
    page.on('pageerror', lambda e: problems.append(f'pageerror: {e}'))
    page.on('console', lambda m: problems.append(f'console.{m.type}: {m.text}') if m.type == 'error' else None)

    # 1. Homepage & citizen login validation
    page.goto(BASE + '/')
    step('Homepage heading', lambda: expect(page.get_by_role('heading', level=1)).to_have_text('CivicFix'))
    page.get_by_role('link', name='Report a Problem').click()
    step('Report a Problem -> citizen login when logged out', lambda: expect(page).to_have_url(re.compile('/citizen/login')))

    def empty_login():
        page.get_by_role('button', name='Log in').click()
        expect(page.get_by_text('Enter your email or ID.')).to_be_visible()
    step('Login validation on empty submit', empty_login)

    def wrong_pw():
        page.fill('#identifier', 'citizen@demo.civicfix')
        page.fill('#password', 'WrongPass1!')
        page.get_by_role('button', name='Log in').click()
        expect(page.get_by_role('alert').filter(has_text='incorrect')).to_be_visible()
    step('Invalid login shows error', wrong_pw)

    def citizen_login():
        page.fill('#password', 'Citizen@123')
        page.get_by_role('button', name='Log in').click()
        expect(page).to_have_url(re.compile('/citizen/dashboard'))
    step('Citizen login redirects to dashboard', citizen_login)

    # 2. Report complaint: validation, then submit
    page.locator('aside').get_by_role('link', name='Report a Complaint').click()
    def form_validation():
        page.get_by_role('button', name='Review Complaint').click()
        expect(page.get_by_text('Give the complaint a short title.')).to_be_visible()
        expect(page.get_by_text('Select a category.')).to_be_visible()
    step('Report form required-field validation', form_validation)

    def fill_form():
        page.fill('#title', 'Large pothole at market junction')
        page.select_option('#category', 'Roads and Potholes')
        page.fill('#description', 'A large pothole near the market junction slows traffic every morning.')
        page.fill('#address', '9 Market Junction')
        page.fill('#locality', 'Ward 5')
        page.fill('#issueDurationDays', '5')
    step('Fill report form', fill_form)

    def bad_days():
        page.fill('#issueDurationDays', '-3')
        page.get_by_role('button', name='Review Complaint').click()
        expect(page.get_by_text('Enter a whole number of days')).to_be_visible()
        page.fill('#issueDurationDays', '5')
    step('Negative duration rejected', bad_days)

    def geo_error():
        page.get_by_role('button', name='Use My Location').click()
        expect(page.get_by_text('Location permission was denied')).to_be_visible(timeout=8000)
    step('Geolocation permission-denied message', geo_error)

    def voice_present():
        expect(page.get_by_role('button', name='Speak Your Complaint')).to_be_visible()
    step('Voice control present (or fallback notice)', voice_present)

    def bad_image():
        page.locator('#image').set_input_files(files=[{'name': 'notes.txt', 'mimeType': 'text/plain', 'buffer': b'hello'}])
        expect(page.get_by_text('Unsupported file type')).to_be_visible()
    step('Image upload rejects wrong file type', bad_image)

    def good_image():
        png = bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cfc0f01f0005000201a5f6453d0000000049454e44ae426082')
        page.locator('#image').set_input_files(files=[{'name': 'pothole.png', 'mimeType': 'image/png', 'buffer': png}])
        expect(page.get_by_alt_text('Preview of the selected image')).to_be_visible()
        expect(page.get_by_role('button', name='Remove')).to_be_visible()
    step('Image upload preview shown', good_image)

    def review_and_submit():
        page.get_by_role('button', name='Review Complaint').click()
        expect(page.get_by_role('heading', name='Review before you submit')).to_be_visible()
        btn = page.get_by_role('button', name='Submit Complaint')
        btn.dblclick()  # test duplicate-submit protection
        expect(page.get_by_role('heading', name='Complaint submitted')).to_be_visible(timeout=6000)
    step('Review and submit (double-click guarded)', review_and_submit)

    cid = page.locator('dd.mono').first.inner_text().strip()
    results.append(('INFO', f'New complaint ID: {cid}'))

    def appears_once():
        page.locator('aside').get_by_role('link', name='My Complaints').click()
        expect(page.get_by_text('Showing 5 of 5 complaints')).to_be_visible()
        n = page.locator('table tbody td.mono', has_text=cid).count()
        assert n == 1, f'expected 1 row for {cid}, found {n}'
    step('New complaint appears once in My Complaints', appears_once)

    page.locator('aside').get_by_role('button', name='Logout').click()
    step('Citizen logout returns home', lambda: expect(page).to_have_url(BASE + '/'))

    # 3. Authority: login, find, update
    page.get_by_role('link', name='Authority Portal').click()
    def auth_login():
        page.fill('#identifier', 'AUTH-DEMO-001')
        page.fill('#password', 'Authority@123')
        page.get_by_role('button', name='Log in').click()
        expect(page).to_have_url(re.compile('/authority/dashboard'))
    step('Authority login -> dashboard', auth_login)

    page.locator('aside').get_by_role('link', name='All Complaints').click()
    def search_find():
        page.fill('#q', cid)
        expect(page.get_by_role('link', name=f'View Details for {cid}').first).to_be_visible()
    step('Authority search finds new complaint', search_find)

    def open_detail():
        page.get_by_role('link', name=f'View Details for {cid}').first.click()
        expect(page.get_by_role('heading', level=1, name='Large pothole at market junction')).to_be_visible()
        expect(page.get_by_text('System analysis')).to_be_visible()
    step('Authority opens detail with analysis', open_detail)

    def set_ongoing():
        page.select_option('#new-status', 'Ongoing')
        page.fill('#status-note', 'Road crew assigned for inspection.')
        page.get_by_role('button', name='Save status').click()
        expect(page.get_by_text('Status updated to Ongoing')).to_be_visible()
    step('Authority sets Ongoing with note', set_ongoing)

    def resolve():
        page.select_option('#new-status', 'Resolved')
        page.fill('#status-note', 'Pothole filled and surface relaid.')
        page.get_by_role('button', name='Save status').click()
        page.get_by_role('button', name='Confirm Resolved').click()
        expect(page.get_by_text('Status updated to Resolved')).to_be_visible()
    step('Authority resolves with confirmation', resolve)

    page.locator('aside').get_by_role('button', name='Logout').click()

    # 4. Citizen sees update, cannot change status
    page.get_by_role('link', name='Log in').first.click()
    def citizen_again():
        page.fill('#identifier', 'citizen@demo.civicfix')
        page.fill('#password', 'Citizen@123')
        page.get_by_role('button', name='Log in').click()
        expect(page).to_have_url(re.compile('/citizen/dashboard'))
        page.locator('aside').get_by_role('link', name='My Complaints').click()
        page.get_by_role('link', name=f'View Details for {cid}').first.click()
        expect(page.get_by_text('Pothole filled and surface relaid.').first).to_be_visible()
        expect(page.get_by_text('Road crew assigned for inspection.').first).to_be_visible()
    step('Citizen sees Resolved status, note, and history', citizen_again)

    def no_controls():
        expect(page.get_by_role('heading', name='Update status')).to_have_count(0)
        expect(page.get_by_role('heading', name='Authority contact')).to_have_count(0)
    step('Citizen cannot see authority status controls', no_controls)

    # 5. Privacy: second citizen cannot see first citizen's complaints
    page.locator('aside').get_by_role('button', name='Logout').click()
    page.get_by_role('link', name='Report a Problem').click()
    def citizen2():
        page.fill('#identifier', 'citizen2@demo.civicfix')
        page.fill('#password', 'Citizen@123')
        page.get_by_role('button', name='Log in').click()
        expect(page).to_have_url(re.compile('/citizen/dashboard'))
        page.locator('aside').get_by_role('link', name='My Complaints').click()
        assert page.get_by_text(cid).count() == 0, 'citizen2 can see citizen1 complaint'
        expect(page.get_by_text('Showing 3 of 3 complaints')).to_be_visible()
    step('Second citizen cannot see other citizen complaints', citizen2)

    # 6. Pending authority blocked
    page.locator('aside').get_by_role('button', name='Logout').click()
    page.get_by_role('link', name='Authority Portal').click()
    def pending():
        page.fill('#identifier', 'AUTH-DEMO-002')
        page.fill('#password', 'Pending@123')
        page.get_by_role('button', name='Log in').click()
        expect(page.get_by_text('awaiting verification')).to_be_visible()
    step('Pending authority cannot log in', pending)

    # 7. Protected route when logged out (reload is fine here: no unsaved data needed)
    page.goto(BASE + '/citizen/dashboard')
    step('Protected route redirects logged-out user', lambda: expect(page).to_have_url(re.compile('/citizen/login')))

    # 8. Responsive: overflow check on public + logged-in pages, desktop and mobile
    overflow_report = []
    public = ['/', '/citizen/login', '/citizen/register', '/authority/login', '/authority/register']
    for w in (375, 1280):
        page.set_viewport_size({'width': w, 'height': 800})
        for path in public:
            page.goto(BASE + path)
            page.wait_for_load_state('networkidle')
            o = overflow(page)
            overflow_report.append((w, path, o))
    # logged-in pages via in-app navigation (no reload, data preserved)
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.goto(BASE + '/')
    page.get_by_role('link', name='Report a Problem').click()
    page.fill('#identifier', 'citizen@demo.civicfix'); page.fill('#password', 'Citizen@123')
    page.get_by_role('button', name='Log in').click()
    expect(page).to_have_url(re.compile('/citizen/dashboard'))
    for w in (375, 1280):
        page.set_viewport_size({'width': w, 'height': 800})
        for label in ['Dashboard', 'Report a Complaint', 'My Complaints', 'Profile', 'Settings']:
            if w == 375:
                page.get_by_role('button', name='Open navigation').click()
            page.locator('aside').get_by_role('link', name=label).click()
            page.wait_for_timeout(250)
            overflow_report.append((w, 'citizen:' + label, overflow(page)))
            if w == 375:
                page.wait_for_timeout(250)
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.locator('aside').get_by_role('button', name='Logout').click()

    bad = [r for r in overflow_report if r[2] > 0]
    results.append(('PASS' if not bad else 'FAIL', f'No horizontal overflow ({len(overflow_report)} page/viewport checks); offenders: {bad}'))

    # 9. Mobile menu on homepage
    page.set_viewport_size({'width': 375, 'height': 800})
    page.goto(BASE + '/')
    def mobile_menu():
        page.get_by_role('button', name='Open menu').click()
        expect(page.get_by_role('navigation', name='Main').get_by_text('Citizen', exact=True)).to_be_visible()
    step('Mobile nav menu opens', mobile_menu)

    # Screenshots for visual review
    page.set_viewport_size({'width': 375, 'height': 800})
    page.screenshot(path='/home/claude/shots/mobile_home_menu.png')
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.goto(BASE + '/')
    page.screenshot(path='/home/claude/shots/desktop_home.png', full_page=False)
    page.goto(BASE + '/citizen/login')
    page.screenshot(path='/home/claude/shots/desktop_login.png')

    browser.close()

