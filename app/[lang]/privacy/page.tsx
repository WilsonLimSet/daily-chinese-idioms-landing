import Link from 'next/link'
import { Metadata } from 'next'
import { LANGUAGES } from '@/src/lib/constants'
import { getTranslation } from '@/src/lib/translations'

export function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

  const localeMap: { [key: string]: string } = {
    'es': 'es_ES',
    'pt': 'pt_BR',
    'id': 'id_ID',
    'vi': 'vi_VN',
    'ja': 'ja_JP',
    'ko': 'ko_KR',
    'th': 'th_TH',
    'hi': 'hi_IN',
    'ar': 'ar_AR',
    'fr': 'fr_FR',
    'tl': 'tl_PH',
    'ms': 'ms_MY',
    'ru': 'ru_RU'
  };

  const ogLocale = localeMap[lang] || 'en_US';
  const alternateLocales = Object.keys(LANGUAGES)
    .filter(l => l !== lang)
    .map(l => localeMap[l] || 'en_US');

  return {
    title: `${getTranslation(lang, 'footerPrivacy')} | Daily Chinese Idioms (${langName})`,
    description: 'Daily Chinese Idiom privacy policy - We do not collect, store, or share any personal information.',
    openGraph: {
      title: `${getTranslation(lang, 'footerPrivacy')} | Daily Chinese Idioms`,
      description: 'Privacy policy for Daily Chinese Idioms app',
      url: `https://www.chineseidioms.com/${lang}/privacy`,
      siteName: 'Daily Chinese Idioms',
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/privacy`,
      languages: {
        'x-default': '/privacy',
        'en': '/privacy',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/privacy`])
        ),
      },
    },
  };
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const privacyContent = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 13, 2025',
      overview: 'Overview',
      overviewText: 'Daily Chinese Idiom is a widget and app that displays Chinese idioms. We believe in complete transparency and want you to know that we do not collect, store, or share any personal information.',
      infoCollection: 'Information Collection',
      infoCollectionText: 'Our app:',
      infoList: [
        'Does not collect personal information',
        'Does not require user registration',
        'Does not track user activity',
        'Does not use cookies',
        'Does not access device location',
        'Does not require internet access',
        'Does not store any user data'
      ],
      widgetFunctionality: 'Widget Functionality',
      widgetText: 'The widget operates completely locally on your device and:',
      widgetList: [
        'Only displays pre-loaded Chinese idioms',
        'Does not transmit any data',
        'Does not access any device features',
        'Does not require any permissions'
      ],
      changes: 'Changes to Our App',
      changesText: 'All idioms and functionality are included in the app installation. Any changes or updates will be made through the App Store update process.'
    },
    es: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última actualización: 13 de enero de 2025',
      overview: 'Resumen',
      overviewText: 'Daily Chinese Idiom es un widget y aplicación que muestra modismos chinos. Creemos en la total transparencia y queremos que sepas que no recopilamos, almacenamos ni compartimos ninguna información personal.',
      infoCollection: 'Recopilación de Información',
      infoCollectionText: 'Nuestra aplicación:',
      infoList: [
        'No recopila información personal',
        'No requiere registro de usuario',
        'No rastrea la actividad del usuario',
        'No utiliza cookies',
        'No accede a la ubicación del dispositivo',
        'No requiere acceso a Internet',
        'No almacena ningún dato del usuario'
      ],
      widgetFunctionality: 'Funcionalidad del Widget',
      widgetText: 'El widget opera completamente de forma local en tu dispositivo y:',
      widgetList: [
        'Solo muestra modismos chinos precargados',
        'No transmite ningún dato',
        'No accede a ninguna función del dispositivo',
        'No requiere ningún permiso'
      ],
      changes: 'Cambios en Nuestra Aplicación',
      changesText: 'Todos los modismos y funcionalidades están incluidos en la instalación de la aplicación. Cualquier cambio o actualización se realizará a través del proceso de actualización de la App Store.'
    },
    pt: {
      title: 'Política de Privacidade',
      lastUpdated: 'Última atualização: 13 de janeiro de 2025',
      overview: 'Visão Geral',
      overviewText: 'Daily Chinese Idiom é um widget e aplicativo que exibe expressões idiomáticas chinesas. Acreditamos em total transparência e queremos que você saiba que não coletamos, armazenamos ou compartilhamos nenhuma informação pessoal.',
      infoCollection: 'Coleta de Informações',
      infoCollectionText: 'Nosso aplicativo:',
      infoList: [
        'Não coleta informações pessoais',
        'Não requer registro de usuário',
        'Não rastreia atividade do usuário',
        'Não usa cookies',
        'Não acessa localização do dispositivo',
        'Não requer acesso à internet',
        'Não armazena nenhum dado do usuário'
      ],
      widgetFunctionality: 'Funcionalidade do Widget',
      widgetText: 'O widget opera completamente localmente no seu dispositivo e:',
      widgetList: [
        'Apenas exibe expressões chinesas pré-carregadas',
        'Não transmite nenhum dado',
        'Não acessa nenhum recurso do dispositivo',
        'Não requer nenhuma permissão'
      ],
      changes: 'Mudanças em Nosso Aplicativo',
      changesText: 'Todas as expressões e funcionalidades estão incluídas na instalação do aplicativo. Quaisquer alterações ou atualizações serão feitas através do processo de atualização da App Store.'
    },
    id: {
      title: 'Kebijakan Privasi',
      lastUpdated: 'Terakhir diperbarui: 13 Januari 2025',
      overview: 'Ringkasan',
      overviewText: 'Daily Chinese Idiom adalah widget dan aplikasi yang menampilkan idiom Tionghoa. Kami percaya pada transparansi penuh dan ingin Anda tahu bahwa kami tidak mengumpulkan, menyimpan, atau membagikan informasi pribadi apa pun.',
      infoCollection: 'Pengumpulan Informasi',
      infoCollectionText: 'Aplikasi kami:',
      infoList: [
        'Tidak mengumpulkan informasi pribadi',
        'Tidak memerlukan pendaftaran pengguna',
        'Tidak melacak aktivitas pengguna',
        'Tidak menggunakan cookies',
        'Tidak mengakses lokasi perangkat',
        'Tidak memerlukan akses internet',
        'Tidak menyimpan data pengguna apa pun'
      ],
      widgetFunctionality: 'Fungsi Widget',
      widgetText: 'Widget beroperasi sepenuhnya secara lokal di perangkat Anda dan:',
      widgetList: [
        'Hanya menampilkan idiom Tionghoa yang sudah dimuat sebelumnya',
        'Tidak mengirimkan data apa pun',
        'Tidak mengakses fitur perangkat apa pun',
        'Tidak memerlukan izin apa pun'
      ],
      changes: 'Perubahan pada Aplikasi Kami',
      changesText: 'Semua idiom dan fungsi sudah termasuk dalam instalasi aplikasi. Setiap perubahan atau pembaruan akan dilakukan melalui proses pembaruan App Store.'
    },
    vi: {
      title: 'Chính Sách Bảo Mật',
      lastUpdated: 'Cập nhật lần cuối: 13 tháng 1, 2025',
      overview: 'Tổng Quan',
      overviewText: 'Daily Chinese Idiom là một widget và ứng dụng hiển thị thành ngữ Trung Quốc. Chúng tôi tin tưởng vào sự minh bạch hoàn toàn và muốn bạn biết rằng chúng tôi không thu thập, lưu trữ hoặc chia sẻ bất kỳ thông tin cá nhân nào.',
      infoCollection: 'Thu Thập Thông Tin',
      infoCollectionText: 'Ứng dụng của chúng tôi:',
      infoList: [
        'Không thu thập thông tin cá nhân',
        'Không yêu cầu đăng ký người dùng',
        'Không theo dõi hoạt động người dùng',
        'Không sử dụng cookies',
        'Không truy cập vị trí thiết bị',
        'Không yêu cầu truy cập internet',
        'Không lưu trữ bất kỳ dữ liệu người dùng nào'
      ],
      widgetFunctionality: 'Chức Năng Widget',
      widgetText: 'Widget hoạt động hoàn toàn cục bộ trên thiết bị của bạn và:',
      widgetList: [
        'Chỉ hiển thị thành ngữ Trung Quốc đã được tải sẵn',
        'Không truyền bất kỳ dữ liệu nào',
        'Không truy cập bất kỳ tính năng thiết bị nào',
        'Không yêu cầu bất kỳ quyền nào'
      ],
      changes: 'Thay Đổi Ứng Dụng',
      changesText: 'Tất cả thành ngữ và chức năng đều được bao gồm trong cài đặt ứng dụng. Mọi thay đổi hoặc cập nhật sẽ được thực hiện thông qua quy trình cập nhật App Store.'
    },
    ja: {
      title: 'プライバシーポリシー',
      lastUpdated: '最終更新日: 2025年1月13日',
      overview: '概要',
      overviewText: 'Daily Chinese Idiomは、中国の慣用句を表示するウィジェットとアプリです。私たちは完全な透明性を信じており、個人情報を収集、保存、共有しないことをお知らせします。',
      infoCollection: '情報収集',
      infoCollectionText: '当アプリは:',
      infoList: [
        '個人情報を収集しません',
        'ユーザー登録を必要としません',
        'ユーザー活動を追跡しません',
        'Cookieを使用しません',
        'デバイスの位置情報にアクセスしません',
        'インターネットアクセスを必要としません',
        'ユーザーデータを保存しません'
      ],
      widgetFunctionality: 'ウィジェット機能',
      widgetText: 'ウィジェットは完全にデバイス上でローカルに動作し:',
      widgetList: [
        'プリロードされた中国の慣用句のみを表示します',
        'データを送信しません',
        'デバイスの機能にアクセスしません',
        '権限を必要としません'
      ],
      changes: 'アプリの変更',
      changesText: 'すべての慣用句と機能はアプリのインストールに含まれています。変更や更新はApp Storeの更新プロセスを通じて行われます。'
    },
    ko: {
      title: '개인정보 보호정책',
      lastUpdated: '마지막 업데이트: 2025년 1월 13일',
      overview: '개요',
      overviewText: 'Daily Chinese Idiom은 중국 관용구를 표시하는 위젯 및 앱입니다. 우리는 완전한 투명성을 믿으며 개인 정보를 수집, 저장 또는 공유하지 않는다는 것을 알려드립니다.',
      infoCollection: '정보 수집',
      infoCollectionText: '저희 앱은:',
      infoList: [
        '개인 정보를 수집하지 않습니다',
        '사용자 등록이 필요하지 않습니다',
        '사용자 활동을 추적하지 않습니다',
        '쿠키를 사용하지 않습니다',
        '기기 위치에 액세스하지 않습니다',
        '인터넷 액세스가 필요하지 않습니다',
        '사용자 데이터를 저장하지 않습니다'
      ],
      widgetFunctionality: '위젯 기능',
      widgetText: '위젯은 기기에서 완전히 로컬로 작동하며:',
      widgetList: [
        '미리 로드된 중국 관용구만 표시합니다',
        '데이터를 전송하지 않습니다',
        '기기 기능에 액세스하지 않습니다',
        '권한이 필요하지 않습니다'
      ],
      changes: '앱 변경 사항',
      changesText: '모든 관용구와 기능은 앱 설치에 포함되어 있습니다. 변경 사항이나 업데이트는 App Store 업데이트 프로세스를 통해 이루어집니다.'
    },
    th: {
      title: 'นโยบายความเป็นส่วนตัว',
      lastUpdated: 'อัปเดตล่าสุด: 13 มกราคม 2025',
      overview: 'ภาพรวม',
      overviewText: 'Daily Chinese Idiom เป็นวิดเจ็ตและแอปที่แสดงสำนวนจีน เราเชื่อในความโปร่งใสอย่างสมบูรณ์และต้องการให้คุณทราบว่าเราไม่รวบรวม จัดเก็บ หรือแบ่งปันข้อมูลส่วนบุคคลใดๆ',
      infoCollection: 'การรวบรวมข้อมูล',
      infoCollectionText: 'แอปของเรา:',
      infoList: [
        'ไม่รวบรวมข้อมูลส่วนบุคคล',
        'ไม่ต้องการการลงทะเบียนผู้ใช้',
        'ไม่ติดตามกิจกรรมของผู้ใช้',
        'ไม่ใช้คุกกี้',
        'ไม่เข้าถึงตำแหน่งของอุปกรณ์',
        'ไม่ต้องการการเข้าถึงอินเทอร์เน็ต',
        'ไม่จัดเก็บข้อมูลผู้ใช้ใดๆ'
      ],
      widgetFunctionality: 'ฟังก์ชันวิดเจ็ต',
      widgetText: 'วิดเจ็ตทำงานภายในอุปกรณ์ของคุณอย่างสมบูรณ์และ:',
      widgetList: [
        'แสดงเฉพาะสำนวนจีนที่โหลดไว้ล่วงหน้า',
        'ไม่ส่งข้อมูลใดๆ',
        'ไม่เข้าถึงคุณสมบัติของอุปกรณ์ใดๆ',
        'ไม่ต้องการสิทธิ์ใดๆ'
      ],
      changes: 'การเปลี่ยนแปลงแอปของเรา',
      changesText: 'สำนวนและฟังก์ชันทั้งหมดรวมอยู่ในการติดตั้งแอป การเปลี่ยนแปลงหรืออัปเดตใดๆ จะทำผ่านกระบวนการอัปเดต App Store'
    },
    hi: {
      title: 'गोपनीयता नीति',
      lastUpdated: 'अंतिम अपडेट: 13 जनवरी, 2025',
      overview: 'अवलोकन',
      overviewText: 'Daily Chinese Idiom एक विजेट और ऐप है जो चीनी मुहावरे प्रदर्शित करता है। हम पूर्ण पारदर्शिता में विश्वास करते हैं और चाहते हैं कि आप जानें कि हम कोई व्यक्तिगत जानकारी एकत्र, संग्रहीत या साझा नहीं करते हैं।',
      infoCollection: 'जानकारी संग्रह',
      infoCollectionText: 'हमारा ऐप:',
      infoList: [
        'व्यक्तिगत जानकारी एकत्र नहीं करता',
        'उपयोगकर्ता पंजीकरण की आवश्यकता नहीं है',
        'उपयोगकर्ता गतिविधि को ट्रैक नहीं करता',
        'कुकीज़ का उपयोग नहीं करता',
        'डिवाइस स्थान तक पहुंच नहीं करता',
        'इंटरनेट एक्सेस की आवश्यकता नहीं है',
        'कोई उपयोगकर्ता डेटा संग्रहीत नहीं करता'
      ],
      widgetFunctionality: 'विजेट कार्यक्षमता',
      widgetText: 'विजेट पूरी तरह से आपके डिवाइस पर स्थानीय रूप से संचालित होता है और:',
      widgetList: [
        'केवल पूर्व-लोड किए गए चीनी मुहावरे प्रदर्शित करता है',
        'कोई डेटा प्रसारित नहीं करता',
        'किसी भी डिवाइस सुविधा तक पहुंच नहीं करता',
        'किसी अनुमति की आवश्यकता नहीं है'
      ],
      changes: 'हमारे ऐप में परिवर्तन',
      changesText: 'सभी मुहावरे और कार्यक्षमता ऐप इंस्टॉलेशन में शामिल हैं। कोई भी परिवर्तन या अपडेट App Store अपडेट प्रक्रिया के माध्यम से किया जाएगा।'
    },
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: 13 يناير 2025',
      overview: 'نظرة عامة',
      overviewText: 'Daily Chinese Idiom هو عنصر واجهة وتطبيق يعرض التعابير الصينية. نؤمن بالشفافية الكاملة ونريد أن تعلم أننا لا نجمع أو نخزن أو نشارك أي معلومات شخصية.',
      infoCollection: 'جمع المعلومات',
      infoCollectionText: 'تطبيقنا:',
      infoList: [
        'لا يجمع المعلومات الشخصية',
        'لا يتطلب تسجيل المستخدم',
        'لا يتتبع نشاط المستخدم',
        'لا يستخدم ملفات تعريف الارتباط',
        'لا يصل إلى موقع الجهاز',
        'لا يتطلب الوصول إلى الإنترنت',
        'لا يخزن أي بيانات مستخدم'
      ],
      widgetFunctionality: 'وظيفة الويدجت',
      widgetText: 'يعمل الويدجت بالكامل محليًا على جهازك و:',
      widgetList: [
        'يعرض فقط التعابير الصينية المحملة مسبقًا',
        'لا ينقل أي بيانات',
        'لا يصل إلى أي ميزات للجهاز',
        'لا يتطلب أي أذونات'
      ],
      changes: 'التغييرات في تطبيقنا',
      changesText: 'جميع التعابير والوظائف مدرجة في تثبيت التطبيق. سيتم إجراء أي تغييرات أو تحديثات من خلال عملية تحديث App Store.'
    },
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 13 janvier 2025',
      overview: 'Aperçu',
      overviewText: 'Daily Chinese Idiom est un widget et une application qui affiche des expressions idiomatiques chinoises. Nous croyons en la transparence totale et voulons que vous sachiez que nous ne collectons, ne stockons ni ne partageons aucune information personnelle.',
      infoCollection: 'Collecte d\'Informations',
      infoCollectionText: 'Notre application:',
      infoList: [
        'Ne collecte pas d\'informations personnelles',
        'Ne nécessite pas d\'inscription d\'utilisateur',
        'Ne suit pas l\'activité de l\'utilisateur',
        'N\'utilise pas de cookies',
        'N\'accède pas à la localisation de l\'appareil',
        'Ne nécessite pas d\'accès Internet',
        'Ne stocke aucune donnée utilisateur'
      ],
      widgetFunctionality: 'Fonctionnalité du Widget',
      widgetText: 'Le widget fonctionne complètement localement sur votre appareil et:',
      widgetList: [
        'Affiche uniquement des expressions chinoises préchargées',
        'Ne transmet aucune donnée',
        'N\'accède à aucune fonctionnalité de l\'appareil',
        'Ne nécessite aucune autorisation'
      ],
      changes: 'Modifications de Notre Application',
      changesText: 'Toutes les expressions et fonctionnalités sont incluses dans l\'installation de l\'application. Toute modification ou mise à jour sera effectuée via le processus de mise à jour de l\'App Store.'
    },
    tl: {
      title: 'Patakaran sa Privacy',
      lastUpdated: 'Huling na-update: Enero 13, 2025',
      overview: 'Pangkalahatang-ideya',
      overviewText: 'Ang Daily Chinese Idiom ay isang widget at app na nagpapakita ng mga idyomang Tsino. Naniniwala kami sa kumpletong transparency at nais naming malaman mo na hindi kami nangongolekta, nag-iimbak, o nagbabahagi ng anumang personal na impormasyon.',
      infoCollection: 'Pangongolekta ng Impormasyon',
      infoCollectionText: 'Ang aming app:',
      infoList: [
        'Hindi nangongolekta ng personal na impormasyon',
        'Hindi nangangailangan ng pagpaparehistro ng user',
        'Hindi sinusubaybayan ang aktibidad ng user',
        'Hindi gumagamit ng cookies',
        'Hindi nag-access sa lokasyon ng device',
        'Hindi nangangailangan ng internet access',
        'Hindi nag-iimbak ng anumang data ng user'
      ],
      widgetFunctionality: 'Functionality ng Widget',
      widgetText: 'Ang widget ay gumagana nang lokal sa iyong device at:',
      widgetList: [
        'Nagpapakita lamang ng pre-loaded na mga idyomang Tsino',
        'Hindi nagpapadala ng anumang data',
        'Hindi nag-access sa anumang feature ng device',
        'Hindi nangangailangan ng anumang pahintulot'
      ],
      changes: 'Mga Pagbabago sa Aming App',
      changesText: 'Lahat ng idioms at functionality ay kasama sa pag-install ng app. Anumang mga pagbabago o update ay gagawin sa pamamagitan ng proseso ng pag-update ng App Store.'
    },
    ms: {
      title: 'Dasar Privasi',
      lastUpdated: 'Kemas kini terakhir: 13 Januari 2025',
      overview: 'Gambaran Keseluruhan',
      overviewText: 'Daily Chinese Idiom ialah widget dan aplikasi yang memaparkan simpulan bahasa Cina. Kami percaya pada ketelusan sepenuhnya dan mahu anda tahu bahawa kami tidak mengumpul, menyimpan atau berkongsi sebarang maklumat peribadi.',
      infoCollection: 'Pengumpulan Maklumat',
      infoCollectionText: 'Aplikasi kami:',
      infoList: [
        'Tidak mengumpul maklumat peribadi',
        'Tidak memerlukan pendaftaran pengguna',
        'Tidak menjejaki aktiviti pengguna',
        'Tidak menggunakan cookies',
        'Tidak mengakses lokasi peranti',
        'Tidak memerlukan akses internet',
        'Tidak menyimpan sebarang data pengguna'
      ],
      widgetFunctionality: 'Fungsi Widget',
      widgetText: 'Widget beroperasi sepenuhnya secara tempatan pada peranti anda dan:',
      widgetList: [
        'Hanya memaparkan simpulan bahasa Cina yang telah dimuat',
        'Tidak menghantar sebarang data',
        'Tidak mengakses sebarang ciri peranti',
        'Tidak memerlukan sebarang kebenaran'
      ],
      changes: 'Perubahan pada Aplikasi Kami',
      changesText: 'Semua simpulan bahasa dan fungsi disertakan dalam pemasangan aplikasi. Sebarang perubahan atau kemas kini akan dibuat melalui proses kemas kini App Store.'
    },
    ru: {
      title: 'Политика конфиденциальности',
      lastUpdated: 'Последнее обновление: 13 января 2025 г.',
      overview: 'Обзор',
      overviewText: 'Daily Chinese Idiom — это виджет и приложение, отображающее китайские идиомы. Мы верим в полную прозрачность и хотим, чтобы вы знали, что мы не собираем, не храним и не передаем какую-либо личную информацию.',
      infoCollection: 'Сбор информации',
      infoCollectionText: 'Наше приложение:',
      infoList: [
        'Не собирает личную информацию',
        'Не требует регистрации пользователя',
        'Не отслеживает активность пользователя',
        'Не использует файлы cookie',
        'Не получает доступ к местоположению устройства',
        'Не требует доступа к интернету',
        'Не хранит никаких данных пользователя'
      ],
      widgetFunctionality: 'Функциональность виджета',
      widgetText: 'Виджет работает полностью локально на вашем устройстве и:',
      widgetList: [
        'Отображает только предварительно загруженные китайские идиомы',
        'Не передает никаких данных',
        'Не получает доступ к функциям устройства',
        'Не требует никаких разрешений'
      ],
      changes: 'Изменения в нашем приложении',
      changesText: 'Все идиомы и функции включены в установку приложения. Любые изменения или обновления будут выполняться через процесс обновления App Store.'
    }
  };

  const content = privacyContent[lang as keyof typeof privacyContent] || privacyContent.en;

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href={`/${lang}`}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{getTranslation(lang, 'backToHome')}</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{content.title}</h1>
            <p className="text-gray-600">{content.lastUpdated}</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{content.overview}</h2>
            <p className="text-gray-700">
              {content.overviewText}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{content.infoCollection}</h2>
            <p className="text-gray-700">{content.infoCollectionText}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {content.infoList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{content.widgetFunctionality}</h2>
            <p className="text-gray-700">{content.widgetText}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {content.widgetList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{content.changes}</h2>
            <p className="text-gray-700">
              {content.changesText}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
