#!/usr/bin/env node
/**
 * Add translations for the 6 new listicles to all language files
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '../public/translations');

// New listicles with translations for all languages
const newListicles = {
  'chinese-idioms-about-perseverance': {
    idiomIds: ['ID005', 'ID009', 'ID090', 'ID106', 'ID107', 'ID201', 'ID224', 'ID233', 'ID032', 'ID154'],
    publishedDate: '2025-02-24',
    translations: {
      ja: {
        slug: 'nintai-chuugokugo-kotowaza',
        title: '諦めない力：忍耐と不屈の精神に関する中国語の成語10選',
        description: '忍耐、粘り強さ、そして困難に立ち向かう力についての感動的な中国語の成語を学びましょう。',
        metaDescription: '忍耐に関する中国語の成語をお探しですか？粘り強さ、決意、諦めないことについての10の力強い成語があなたを励まします。',
        keywords: ['忍耐 中国語', '中国語 成語 忍耐', '粘り強さ 中国語', '諦めない 中国語', '水滴石穿 意味', '百折不挠 意味', '自强不息 意味', '愚公移山 意味', '鉄杵成針 意味'],
        intro: '中国語で「忍耐」をどのように表現しますか？これらの力強い成語は、世代を超えて人々を鼓舞してきた粘り強さと決意の精神を表しています。',
        category: '忍耐'
      },
      th: {
        slug: 'sam-nuan-jin-kiew-kap-khwam-pha-yayam',
        title: '10 สำนวนจีนทรงพลังเกี่ยวกับความพยายามและการไม่ยอมแพ้',
        description: 'สำนวนจีนที่สร้างแรงบันดาลใจเกี่ยวกับความพยายาม ความอดทน และพลังในการก้าวต่อไป',
        metaDescription: 'กำลังมองหาสำนวนจีนเกี่ยวกับความพยายามหรือไม่? สำนวน 10 สำนวนนี้เกี่ยวกับความอดทนและการไม่ยอมแพ้จะสร้างแรงบันดาลใจให้คุณ',
        keywords: ['ความพยายาม ภาษาจีน', 'สำนวนจีน ความอดทน', 'ไม่ยอมแพ้ ภาษาจีน', '水滴石穿 แปล', '百折不挠 แปล', '自强不息 แปล', '愚公移山 แปล', '锲而不舍 แปล'],
        intro: 'คุณจะแสดงออกถึง "ความพยายาม" ในภาษาจีนอย่างไร? สำนวนทรงพลังเหล่านี้จับจิตวิญญาณแห่งความอดทนและความมุ่งมั่นที่สร้างแรงบันดาลใจมาหลายชั่วอายุคน',
        category: 'ความพยายาม'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-ve-su-kien-tri',
        title: '10 Thành Ngữ Tiếng Trung Về Sự Kiên Trì và Không Bỏ Cuộc',
        description: 'Những thành ngữ tiếng Trung đầy cảm hứng về sự kiên trì, bền bỉ và sức mạnh để tiếp tục tiến về phía trước.',
        metaDescription: 'Bạn đang tìm thành ngữ tiếng Trung về sự kiên trì? 10 thành ngữ mạnh mẽ này về quyết tâm và không bỏ cuộc sẽ truyền cảm hứng cho bạn.',
        keywords: ['kiên trì tiếng trung', 'thành ngữ tiếng trung kiên trì', 'không bỏ cuộc tiếng trung', '水滴石穿 là gì', '百折不挠 là gì', '自强不息 là gì', '愚公移山 là gì'],
        intro: 'Bạn diễn đạt "sự kiên trì" trong tiếng Trung như thế nào? Những thành ngữ mạnh mẽ này thể hiện tinh thần bền bỉ và quyết tâm đã truyền cảm hứng cho nhiều thế hệ.',
        category: 'Kiên Trì'
      },
      ko: {
        slug: 'in-nae-jungguk-seogeo',
        title: '포기하지 않는 힘: 인내와 끈기에 관한 중국어 성어 10선',
        description: '인내, 끈기, 그리고 계속 나아가는 힘에 관한 영감을 주는 중국어 성어를 배워보세요.',
        metaDescription: '인내에 관한 중국어 성어를 찾고 계신가요? 끈기, 결단력, 포기하지 않는 것에 관한 10가지 강력한 성어가 당신에게 영감을 줄 것입니다.',
        keywords: ['인내 중국어', '중국어 성어 인내', '끈기 중국어', '포기하지 않는 중국어', '水滴石穿 뜻', '百折不挠 뜻', '自强不息 뜻'],
        intro: '중국어로 "인내"를 어떻게 표현할까요? 이 강력한 성어들은 여러 세대에 걸쳐 사람들에게 영감을 준 끈기와 결단력의 정신을 담고 있습니다.',
        category: '인내'
      },
      es: {
        slug: 'modismos-chinos-sobre-perseverancia',
        title: '10 Poderosos Modismos Chinos Sobre la Perseverancia y No Rendirse',
        description: 'Modismos chinos inspiradores sobre la perseverancia, la persistencia y la fuerza para seguir adelante.',
        metaDescription: '¿Buscas modismos chinos sobre la perseverancia? Estos 10 poderosos chengyu sobre determinación y no rendirse te inspirarán.',
        keywords: ['perseverancia en chino', 'modismos chinos perseverancia', 'no rendirse chino', 'determinación chino', '水滴石穿 significado', '百折不挠 significado'],
        intro: '¿Cómo expresas perseverancia en chino? Estos poderosos modismos capturan el espíritu de persistencia y determinación que ha inspirado a generaciones.',
        category: 'Perseverancia'
      },
      fr: {
        slug: 'expressions-chinoises-sur-la-perseverance',
        title: '10 Expressions Chinoises Puissantes Sur la Persévérance',
        description: 'Des expressions chinoises inspirantes sur la persévérance, la persistance et la force de continuer.',
        metaDescription: 'Vous cherchez des expressions chinoises sur la persévérance? Ces 10 puissants chengyu sur la détermination vous inspireront.',
        keywords: ['persévérance en chinois', 'expressions chinoises persévérance', 'ne pas abandonner chinois', '水滴石穿 signification', '百折不挠 signification'],
        intro: 'Comment exprimer la persévérance en chinois? Ces puissantes expressions capturent l\'esprit de persistance et de détermination qui a inspiré des générations.',
        category: 'Persévérance'
      },
      pt: {
        slug: 'modismos-chineses-sobre-perseveranca',
        title: '10 Poderosos Modismos Chineses Sobre Perseverança e Não Desistir',
        description: 'Modismos chineses inspiradores sobre perseverança, persistência e força para continuar.',
        metaDescription: 'Procurando modismos chineses sobre perseverança? Estes 10 poderosos chengyu sobre determinação e não desistir irão inspirá-lo.',
        keywords: ['perseverança em chinês', 'modismos chineses perseverança', 'não desistir chinês', '水滴石穿 significado', '百折不挠 significado'],
        intro: 'Como expressar perseverança em chinês? Esses poderosos modismos capturam o espírito de persistência e determinação que inspirou gerações.',
        category: 'Perseverança'
      },
      id: {
        slug: 'idiom-cina-tentang-ketekunan',
        title: '10 Idiom Cina yang Kuat Tentang Ketekunan dan Pantang Menyerah',
        description: 'Idiom Cina yang menginspirasi tentang ketekunan, kegigihan, dan kekuatan untuk terus maju.',
        metaDescription: 'Mencari idiom Cina tentang ketekunan? 10 chengyu yang kuat tentang tekad dan pantang menyerah ini akan menginspirasi Anda.',
        keywords: ['ketekunan dalam bahasa cina', 'idiom cina ketekunan', 'pantang menyerah cina', '水滴石穿 artinya', '百折不挠 artinya', '自强不息 artinya'],
        intro: 'Bagaimana mengekspresikan ketekunan dalam bahasa Cina? Idiom-idiom kuat ini menangkap semangat kegigihan dan tekad yang telah menginspirasi generasi.',
        category: 'Ketekunan'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-tentang-ketekunan',
        title: '10 Simpulan Bahasa Cina yang Berkuasa Tentang Ketekunan',
        description: 'Simpulan bahasa Cina yang memberi inspirasi tentang ketekunan, ketabahan, dan kekuatan untuk terus maju.',
        metaDescription: 'Mencari simpulan bahasa Cina tentang ketekunan? 10 chengyu berkuasa tentang keazaman ini akan memberi inspirasi kepada anda.',
        keywords: ['ketekunan dalam bahasa cina', 'simpulan bahasa cina ketekunan', 'pantang menyerah cina', '水滴石穿 maksud', '百折不挠 maksud', '自强不息 in chinese'],
        intro: 'Bagaimana untuk menyatakan ketekunan dalam bahasa Cina? Simpulan bahasa berkuasa ini menangkap semangat ketabahan yang telah memberi inspirasi kepada generasi.',
        category: 'Ketekunan'
      },
      hi: {
        slug: 'dridhta-ke-baare-mein-chini-muhavare',
        title: 'दृढ़ता और हार न मानने के बारे में 10 शक्तिशाली चीनी मुहावरे',
        description: 'दृढ़ता, लगन और आगे बढ़ते रहने की शक्ति के बारे में प्रेरणादायक चीनी मुहावरे।',
        metaDescription: 'दृढ़ता के बारे में चीनी मुहावरे खोज रहे हैं? संकल्प और हार न मानने के बारे में ये 10 शक्तिशाली चेंग्यू आपको प्रेरित करेंगे।',
        keywords: ['दृढ़ता चीनी में', 'चीनी मुहावरे दृढ़ता', 'हार न मानना चीनी', '水滴石穿 का अर्थ', '百折不挠 का अर्थ'],
        intro: 'चीनी में दृढ़ता कैसे व्यक्त करें? ये शक्तिशाली मुहावरे लगन और संकल्प की भावना को दर्शाते हैं जिसने पीढ़ियों को प्रेरित किया है।',
        category: 'दृढ़ता'
      },
      ar: {
        slug: 'taabir-siniya-aan-almuthaabraa',
        title: '10 تعابير صينية قوية عن المثابرة وعدم الاستسلام',
        description: 'تعابير صينية ملهمة عن المثابرة والإصرار وقوة الاستمرار.',
        metaDescription: 'تبحث عن تعابير صينية عن المثابرة؟ هذه التعابير العشرة القوية عن العزيمة وعدم الاستسلام ستلهمك.',
        keywords: ['المثابرة بالصينية', 'تعابير صينية مثابرة', 'عدم الاستسلام صيني', '水滴石穿 معنى', '百折不挠 معنى'],
        intro: 'كيف تعبر عن المثابرة بالصينية؟ هذه التعابير القوية تجسد روح الإصرار والعزيمة التي ألهمت الأجيال.',
        category: 'المثابرة'
      },
      ru: {
        slug: 'kitajskie-idiomy-o-uporstve',
        title: '10 Мощных Китайских Идиом о Настойчивости и Упорстве',
        description: 'Вдохновляющие китайские идиомы о настойчивости, упорстве и силе двигаться вперёд.',
        metaDescription: 'Ищете китайские идиомы о настойчивости? Эти 10 мощных чэнъюй о решимости и упорстве вдохновят вас.',
        keywords: ['настойчивость по-китайски', 'китайские идиомы настойчивость', 'не сдаваться китайский', '水滴石穿 значение', '百折不挠 значение', 'терпение китайский'],
        intro: 'Как выразить настойчивость по-китайски? Эти мощные идиомы отражают дух упорства и решимости, вдохновлявший поколения.',
        category: 'Настойчивость'
      },
      tl: {
        slug: 'idyoma-ng-tsino-tungkol-sa-pagtitiyaga',
        title: '10 Makapangyarihang Idyoma ng Tsino Tungkol sa Pagtitiyaga',
        description: 'Mga nakaka-inspire na idyoma ng Tsino tungkol sa pagtitiyaga, pagtitiis, at lakas na magpatuloy.',
        metaDescription: 'Naghahanap ng idyoma ng Tsino tungkol sa pagtitiyaga? Ang 10 makapangyarihang chengyu na ito tungkol sa determinasyon ay magbibigay-inspirasyon sa iyo.',
        keywords: ['pagtitiyaga sa tsino', 'idyoma ng tsino pagtitiyaga', 'huwag sumuko tsino', '水滴石穿 kahulugan', '百折不挠 kahulugan'],
        intro: 'Paano ipahayag ang pagtitiyaga sa Tsino? Ang mga makapangyarihang idyoma na ito ay nagpapakita ng diwa ng pagtitiis at determinasyon na nag-inspire sa mga henerasyon.',
        category: 'Pagtitiyaga'
      }
    }
  },
  'chinese-beauty-idioms-four-beauties': {
    idiomIds: ['ID114', 'ID341', 'ID056', 'ID040', 'ID118', 'ID196', 'ID084', 'ID248'],
    publishedDate: '2025-02-25',
    translations: {
      ja: {
        slug: 'chuugoku-bi-kotowaza-shidaibi',
        title: '美についての詩的な中国語の成語8選（閉月羞花と四大美人）',
        description: '古代中国の四大美人から生まれた閉月羞花、沈魚落雁など、美を表現する最も美しい中国語の成語を発見しましょう。',
        metaDescription: '閉月羞花の意味とは？四大美人の表現を含む、美についての8つの美しい中国語の成語を学びましょう。',
        keywords: ['閉月羞花 意味', '閉月羞花 とは', '沈魚落雁 意味', '四大美人 成語', '美 中国語 成語', '羞花閉月 意味', '閉月羞花 由来'],
        intro: '閉月羞花（bì yuè xiū huā）とはどういう意味でしょうか？この象徴的な成語は、月も隠れ花も恥じらうほどの美しさを表現しています。',
        category: '美と自然'
      },
      th: {
        slug: 'sam-nuan-jin-khwam-ngam-si-nang-ngam',
        title: '8 สำนวนจีนเกี่ยวกับความงาม (闭月羞花 และสี่นางงามแห่งจีน)',
        description: 'ค้นพบสำนวนจีนที่สวยงามที่สุดที่บรรยายความงาม รวมถึง 闭月羞花 และ 沉鱼落雁 จากสี่นางงามแห่งจีนโบราณ',
        metaDescription: '闭月羞花 หมายความว่าอะไร? เรียนรู้ 8 สำนวนจีนที่สวยงามเกี่ยวกับความงาม เหมาะสำหรับบรรยายความสง่างาม',
        keywords: ['闭月羞花 แปล', '闭月羞花 ความหมาย', '沉鱼落雁 แปล', 'สำนวนจีน ความงาม', 'สี่นางงามจีน', '閉月羞花 แปล'],
        intro: '闭月羞花 (bì yuè xiū huā) หมายความว่าอะไร? สำนวนนี้บรรยายความงามที่งดงามจนดวงจันทร์ต้องซ่อนตัวและดอกไม้รู้สึกอาย',
        category: 'ความงามและธรรมชาติ'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-ve-ve-dep',
        title: '8 Thành Ngữ Tiếng Trung Về Vẻ Đẹp (闭月羞花 và Tứ Đại Mỹ Nhân)',
        description: 'Khám phá những thành ngữ tiếng Trung đẹp nhất mô tả vẻ đẹp, bao gồm 闭月羞花 và 沉鱼落雁 từ Tứ Đại Mỹ Nhân.',
        metaDescription: '闭月羞花 có nghĩa gì? Học 8 thành ngữ tiếng Trung đẹp về vẻ đẹp, hoàn hảo để mô tả sự thanh lịch.',
        keywords: ['闭月羞花 là gì', '沉鱼落雁 là gì', 'thành ngữ tiếng trung vẻ đẹp', 'tứ đại mỹ nhân', '閉月羞花 nghĩa là gì'],
        intro: '闭月羞花 (bì yuè xiū huā) có nghĩa gì? Thành ngữ này mô tả vẻ đẹp tuyệt vời đến mức trăng phải trốn và hoa cảm thấy xấu hổ.',
        category: 'Vẻ Đẹp và Thiên Nhiên'
      },
      ko: {
        slug: 'jungguk-mi-seogeo-sadaemiin',
        title: '아름다움에 관한 시적인 중국어 성어 8선 (폐월수화와 사대미인)',
        description: '고대 중국 사대미인에서 유래한 폐월수화, 침어낙안 등 아름다움을 표현하는 중국어 성어를 발견하세요.',
        metaDescription: '폐월수화(闭月羞花)의 의미는? 사대미인 표현을 포함한 아름다움에 관한 8가지 중국어 성어를 배워보세요.',
        keywords: ['폐월수화 뜻', '침어낙안 뜻', '사대미인 성어', '아름다움 중국어', '闭月羞花 뜻', '沉鱼落雁 뜻'],
        intro: '폐월수화(闭月羞花)는 무슨 뜻일까요? 이 상징적인 성어는 달도 숨고 꽃도 부끄러워할 만큼 아름다움을 표현합니다.',
        category: '아름다움과 자연'
      },
      es: {
        slug: 'modismos-chinos-sobre-belleza',
        title: '8 Modismos Chinos Poéticos Sobre la Belleza (闭月羞花 y Las Cuatro Bellezas)',
        description: 'Descubre los modismos chinos más hermosos sobre la belleza, incluyendo 闭月羞花 y 沉鱼落雁 de las Cuatro Bellezas.',
        metaDescription: '¿Qué significa 闭月羞花? Aprende 8 hermosos modismos chinos sobre la belleza de las Cuatro Bellezas de la antigua China.',
        keywords: ['modismos chinos belleza', 'cuatro bellezas chinas', '闭月羞花 significado', '沉鱼落雁 significado', 'belleza en chino'],
        intro: '¿Qué significa 闭月羞花 (bì yuè xiū huā)? Este icónico modismo describe una belleza tan impresionante que la luna se esconde y las flores se avergüenzan.',
        category: 'Belleza y Naturaleza'
      },
      fr: {
        slug: 'expressions-chinoises-sur-la-beaute',
        title: '8 Expressions Chinoises Poétiques Sur la Beauté (Les Quatre Beautés)',
        description: 'Découvrez les plus belles expressions chinoises sur la beauté, y compris 闭月羞花 et 沉鱼落雁 des Quatre Beautés.',
        metaDescription: 'Que signifie 闭月羞花? Apprenez 8 belles expressions chinoises sur la beauté des Quatre Beautés de la Chine ancienne.',
        keywords: ['expressions chinoises beauté', 'quatre beautés chinoises', '闭月羞花 signification', '沉鱼落雁 signification'],
        intro: 'Que signifie 闭月羞花 (bì yuè xiū huā)? Cette expression iconique décrit une beauté si impressionnante que la lune se cache et les fleurs ont honte.',
        category: 'Beauté et Nature'
      },
      pt: {
        slug: 'modismos-chineses-sobre-beleza',
        title: '8 Modismos Chineses Poéticos Sobre Beleza (As Quatro Beldades)',
        description: 'Descubra os modismos chineses mais bonitos sobre beleza, incluindo 闭月羞花 e 沉鱼落雁 das Quatro Beldades.',
        metaDescription: 'O que significa 闭月羞花? Aprenda 8 belos modismos chineses sobre beleza das Quatro Beldades da China antiga.',
        keywords: ['modismos chineses beleza', 'quatro beldades chinesas', '闭月羞花 significado', '沉鱼落雁 significado'],
        intro: 'O que significa 闭月羞花 (bì yuè xiū huā)? Este modismo icônico descreve uma beleza tão impressionante que a lua se esconde e as flores sentem vergonha.',
        category: 'Beleza e Natureza'
      },
      id: {
        slug: 'idiom-cina-tentang-kecantikan',
        title: '8 Idiom Cina Puitis Tentang Kecantikan (Empat Kecantikan)',
        description: 'Temukan idiom Cina paling indah tentang kecantikan, termasuk 闭月羞花 dan 沉鱼落雁 dari Empat Kecantikan.',
        metaDescription: 'Apa arti 闭月羞花? Pelajari 8 idiom Cina indah tentang kecantikan dari Empat Kecantikan Tiongkok kuno.',
        keywords: ['idiom cina kecantikan', 'empat kecantikan cina', '闭月羞花 artinya', '沉鱼落雁 artinya'],
        intro: 'Apa arti 闭月羞花 (bì yuè xiū huā)? Idiom ikonik ini menggambarkan kecantikan yang begitu menakjubkan hingga bulan bersembunyi dan bunga merasa malu.',
        category: 'Kecantikan dan Alam'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-tentang-kecantikan',
        title: '8 Simpulan Bahasa Cina Puitis Tentang Kecantikan (Empat Kecantikan)',
        description: 'Temui simpulan bahasa Cina paling indah tentang kecantikan, termasuk 闭月羞花 dan 沉鱼落雁.',
        metaDescription: 'Apa maksud 闭月羞花? Pelajari 8 simpulan bahasa Cina indah tentang kecantikan dari Empat Kecantikan China purba.',
        keywords: ['simpulan bahasa cina kecantikan', 'empat kecantikan cina', '闭月羞花 maksud', '沉鱼落雁 maksud', '闭月羞花 in chinese'],
        intro: 'Apa maksud 闭月羞花 (bì yuè xiū huā)? Simpulan bahasa ikonik ini menggambarkan kecantikan yang begitu mengagumkan hingga bulan bersembunyi.',
        category: 'Kecantikan dan Alam'
      },
      hi: {
        slug: 'sundarta-ke-baare-mein-chini-muhavare',
        title: 'सुंदरता के बारे में 8 काव्यात्मक चीनी मुहावरे (चार सुंदरियां)',
        description: 'प्राचीन चीन की चार सुंदरियों से 闭月羞花 और 沉鱼落雁 सहित सुंदरता के बारे में सबसे सुंदर चीनी मुहावरे खोजें।',
        metaDescription: '闭月羞花 का क्या अर्थ है? चार सुंदरियों से सुंदरता के बारे में 8 सुंदर चीनी मुहावरे सीखें।',
        keywords: ['सुंदरता चीनी मुहावरे', 'चार सुंदरियां चीनी', '闭月羞花 का अर्थ', '沉鱼落雁 का अर्थ'],
        intro: '闭月羞花 (bì yuè xiū huā) का क्या अर्थ है? यह प्रतिष्ठित मुहावरा ऐसी सुंदरता का वर्णन करता है जिससे चंद्रमा छिप जाता है और फूल शर्मा जाते हैं।',
        category: 'सुंदरता और प्रकृति'
      },
      ar: {
        slug: 'taabir-siniya-aan-aljamal',
        title: '8 تعابير صينية شعرية عن الجمال (الجميلات الأربع)',
        description: 'اكتشف أجمل التعابير الصينية عن الجمال، بما في ذلك 闭月羞花 و 沉鱼落雁 من الجميلات الأربع.',
        metaDescription: 'ما معنى 闭月羞花؟ تعلم 8 تعابير صينية جميلة عن الجمال من الجميلات الأربع في الصين القديمة.',
        keywords: ['تعابير صينية جمال', 'الجميلات الأربع صينية', '闭月羞花 معنى', '沉鱼落雁 معنى'],
        intro: 'ما معنى 闭月羞花 (bì yuè xiū huā)؟ هذا التعبير الأيقوني يصف جمالاً مذهلاً لدرجة أن القمر يختبئ والزهور تخجل.',
        category: 'الجمال والطبيعة'
      },
      ru: {
        slug: 'kitajskie-idiomy-o-krasote',
        title: '8 Поэтических Китайских Идиом о Красоте (Четыре Красавицы)',
        description: 'Откройте самые красивые китайские идиомы о красоте, включая 闭月羞花 и 沉鱼落雁 от Четырёх Красавиц.',
        metaDescription: 'Что означает 闭月羞花? Изучите 8 красивых китайских идиом о красоте от Четырёх Красавиц древнего Китая.',
        keywords: ['китайские идиомы красота', 'четыре красавицы китай', '闭月羞花 значение', '沉鱼落雁 значение'],
        intro: 'Что означает 闭月羞花 (bì yuè xiū huā)? Эта знаковая идиома описывает красоту настолько поразительную, что луна прячется, а цветы стыдятся.',
        category: 'Красота и Природа'
      },
      tl: {
        slug: 'idyoma-ng-tsino-tungkol-sa-kagandahan',
        title: '8 Patulang Idyoma ng Tsino Tungkol sa Kagandahan (Apat na Kagandahan)',
        description: 'Tuklasin ang pinakamagagandang idyoma ng Tsino tungkol sa kagandahan, kasama ang 闭月羞花 at 沉鱼落雁.',
        metaDescription: 'Ano ang ibig sabihin ng 闭月羞花? Matuto ng 8 magagandang idyoma ng Tsino tungkol sa kagandahan mula sa Apat na Kagandahan.',
        keywords: ['idyoma ng tsino kagandahan', 'apat na kagandahan tsino', '闭月羞花 kahulugan', '沉鱼落雁 kahulugan'],
        intro: 'Ano ang ibig sabihin ng 闭月羞花 (bì yuè xiū huā)? Ang ikonikong idyoma na ito ay naglalarawan ng kagandahang napakaganda na nagtatago ang buwan at nahihiya ang mga bulaklak.',
        category: 'Kagandahan at Kalikasan'
      }
    }
  },
  'chinese-idioms-english-translations': {
    idiomIds: ['ID102', 'ID010', 'ID134', 'ID048', 'ID053', 'ID033', 'ID295', 'ID234', 'ID037', 'ID200', 'ID042', 'ID249', 'ID131', 'ID084', 'ID114'],
    publishedDate: '2025-02-26',
    translations: {
      ja: {
        slug: 'chuugokugo-seigo-eigo-honyaku',
        title: '最も検索される中国語成語15選と英語翻訳',
        description: '最も検索される中国語成語とその英語翻訳。正確な成語の意味を探している学習者に最適です。',
        metaDescription: '中国語成語の英語翻訳をお探しですか？このガイドでは、雪中送炭、举一反三、饮水思源など最も検索される15の成語を解説します。',
        keywords: ['中国語 成語 英語', '成語 翻訳', '雪中送炭 英語', '举一反三 英語', '饮水思源 意味', '望梅止渴 意味', '胸有成竹 英語'],
        intro: '中国語成語の英語翻訳をお探しですか？このガイドでは、最も検索される中国語成語の正確な英語翻訳を、ピンイン発音と使用例とともに提供します。',
        category: '学習'
      },
      th: {
        slug: 'sam-nuan-jin-plae-phasa-angkrit',
        title: '15 สำนวนจีนที่ค้นหามากที่สุดพร้อมคำแปลภาษาอังกฤษ',
        description: 'สำนวนจีนที่ค้นหามากที่สุดพร้อมคำแปลภาษาอังกฤษ เหมาะสำหรับผู้เรียนที่ต้องการความหมายที่ถูกต้อง',
        metaDescription: 'กำลังมองหาคำแปลภาษาอังกฤษของสำนวนจีนหรือไม่? คู่มือนี้ครอบคลุม 15 สำนวนที่ค้นหามากที่สุด',
        keywords: ['สำนวนจีน แปลอังกฤษ', '成语 แปล', '雪中送炭 แปล', '举一反三 แปล', '饮水思源 แปล', '望梅止渴 แปล'],
        intro: 'กำลังมองหาคำแปลภาษาอังกฤษของสำนวนจีนหรือไม่? คู่มือนี้ให้คำแปลที่ถูกต้องสำหรับสำนวนจีนที่ค้นหามากที่สุด',
        category: 'การเรียนรู้'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-dich-tieng-anh',
        title: '15 Thành Ngữ Tiếng Trung Được Tìm Kiếm Nhiều Nhất Với Bản Dịch Tiếng Anh',
        description: 'Những thành ngữ tiếng Trung được tìm kiếm nhiều nhất với bản dịch tiếng Anh chính xác.',
        metaDescription: 'Bạn đang tìm bản dịch tiếng Anh cho thành ngữ tiếng Trung? Hướng dẫn này bao gồm 15 thành ngữ được tìm kiếm nhiều nhất.',
        keywords: ['thành ngữ tiếng trung dịch tiếng anh', '雪中送炭 là gì', '举一反三 là gì', '饮水思源 là gì', '望梅止渴 là gì'],
        intro: 'Bạn đang tìm bản dịch tiếng Anh cho thành ngữ tiếng Trung? Hướng dẫn này cung cấp bản dịch chính xác cho những thành ngữ được tìm kiếm nhiều nhất.',
        category: 'Học Tập'
      },
      ko: {
        slug: 'jungguk-seogeo-yeongeo-beonyeok',
        title: '가장 많이 검색되는 중국어 성어 15선과 영어 번역',
        description: '가장 많이 검색되는 중국어 성어와 영어 번역. 정확한 의미를 찾는 학습자에게 완벽합니다.',
        metaDescription: '중국어 성어 영어 번역을 찾고 계신가요? 이 가이드는 雪中送炭, 举一反三 등 가장 많이 검색되는 15개 성어를 다룹니다.',
        keywords: ['중국어 성어 영어', '성어 번역', '雪中送炭 뜻', '举一反三 뜻', '饮水思源 뜻', '望梅止渴 뜻'],
        intro: '중국어 성어 영어 번역을 찾고 계신가요? 이 가이드는 가장 많이 검색되는 중국어 성어의 정확한 영어 번역을 제공합니다.',
        category: '학습'
      },
      es: {
        slug: 'modismos-chinos-traduccion-ingles',
        title: '15 Modismos Chinos Más Buscados con Traducciones al Inglés',
        description: 'Los modismos chinos más buscados con sus traducciones al inglés. Perfecto para estudiantes.',
        metaDescription: '¿Buscas traducciones al inglés de modismos chinos? Esta guía cubre los 15 chengyu más buscados.',
        keywords: ['modismos chinos traducción inglés', 'chengyu en inglés', '雪中送炭 significado', '举一反三 significado'],
        intro: '¿Buscas traducciones al inglés de modismos chinos? Esta guía proporciona traducciones precisas para los modismos más buscados.',
        category: 'Aprendizaje'
      },
      fr: {
        slug: 'expressions-chinoises-traduction-anglais',
        title: '15 Expressions Chinoises Les Plus Recherchées avec Traductions Anglaises',
        description: 'Les expressions chinoises les plus recherchées avec leurs traductions anglaises.',
        metaDescription: 'Vous cherchez des traductions anglaises d\'expressions chinoises? Ce guide couvre les 15 chengyu les plus recherchés.',
        keywords: ['expressions chinoises traduction anglais', 'chengyu en anglais', '雪中送炭 signification', '举一反三 signification'],
        intro: 'Vous cherchez des traductions anglaises d\'expressions chinoises? Ce guide fournit des traductions précises pour les expressions les plus recherchées.',
        category: 'Apprentissage'
      },
      pt: {
        slug: 'modismos-chineses-traducao-ingles',
        title: '15 Modismos Chineses Mais Pesquisados com Traduções em Inglês',
        description: 'Os modismos chineses mais pesquisados com suas traduções em inglês.',
        metaDescription: 'Procurando traduções em inglês de modismos chineses? Este guia cobre os 15 chengyu mais pesquisados.',
        keywords: ['modismos chineses tradução inglês', 'chengyu em inglês', '雪中送炭 significado', '举一反三 significado'],
        intro: 'Procurando traduções em inglês de modismos chineses? Este guia fornece traduções precisas para os modismos mais pesquisados.',
        category: 'Aprendizado'
      },
      id: {
        slug: 'idiom-cina-terjemahan-inggris',
        title: '15 Idiom Cina Paling Dicari dengan Terjemahan Bahasa Inggris',
        description: 'Idiom Cina paling dicari dengan terjemahan bahasa Inggris yang akurat.',
        metaDescription: 'Mencari terjemahan bahasa Inggris idiom Cina? Panduan ini mencakup 15 chengyu paling dicari.',
        keywords: ['idiom cina terjemahan inggris', 'chengyu dalam bahasa inggris', '雪中送炭 artinya', '举一反三 artinya'],
        intro: 'Mencari terjemahan bahasa Inggris idiom Cina? Panduan ini menyediakan terjemahan akurat untuk idiom paling dicari.',
        category: 'Pembelajaran'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-terjemahan-inggeris',
        title: '15 Simpulan Bahasa Cina Paling Dicari dengan Terjemahan Inggeris',
        description: 'Simpulan bahasa Cina paling dicari dengan terjemahan bahasa Inggeris yang tepat.',
        metaDescription: 'Mencari terjemahan Inggeris simpulan bahasa Cina? Panduan ini merangkumi 15 chengyu paling dicari.',
        keywords: ['simpulan bahasa cina terjemahan inggeris', 'chengyu in english', '雪中送炭 maksud', '举一反三 maksud'],
        intro: 'Mencari terjemahan Inggeris simpulan bahasa Cina? Panduan ini menyediakan terjemahan tepat untuk simpulan bahasa paling dicari.',
        category: 'Pembelajaran'
      },
      hi: {
        slug: 'chini-muhavare-angrezi-anuvaad',
        title: 'सबसे अधिक खोजे जाने वाले 15 चीनी मुहावरे अंग्रेजी अनुवाद के साथ',
        description: 'सबसे अधिक खोजे जाने वाले चीनी मुहावरे उनके अंग्रेजी अनुवाद के साथ।',
        metaDescription: 'चीनी मुहावरों का अंग्रेजी अनुवाद खोज रहे हैं? यह मार्गदर्शिका 15 सबसे अधिक खोजे जाने वाले चेंग्यू को कवर करती है।',
        keywords: ['चीनी मुहावरे अंग्रेजी अनुवाद', '雪中送炭 का अर्थ', '举一反三 का अर्थ', '饮水思源 का अर्थ'],
        intro: 'चीनी मुहावरों का अंग्रेजी अनुवाद खोज रहे हैं? यह मार्गदर्शिका सबसे अधिक खोजे जाने वाले मुहावरों के सटीक अनुवाद प्रदान करती है।',
        category: 'सीखना'
      },
      ar: {
        slug: 'taabir-siniya-tarjama-injliziya',
        title: '15 تعبيراً صينياً الأكثر بحثاً مع ترجمات إنجليزية',
        description: 'التعابير الصينية الأكثر بحثاً مع ترجماتها الإنجليزية الدقيقة.',
        metaDescription: 'تبحث عن ترجمات إنجليزية للتعابير الصينية؟ هذا الدليل يغطي 15 تشينغيو الأكثر بحثاً.',
        keywords: ['تعابير صينية ترجمة إنجليزية', '雪中送炭 معنى', '举一反三 معنى', '饮水思源 معنى'],
        intro: 'تبحث عن ترجمات إنجليزية للتعابير الصينية؟ هذا الدليل يوفر ترجمات دقيقة للتعابير الأكثر بحثاً.',
        category: 'التعلم'
      },
      ru: {
        slug: 'kitajskie-idiomy-anglijskij-perevod',
        title: '15 Самых Популярных Китайских Идиом с Английским Переводом',
        description: 'Самые популярные китайские идиомы с точным английским переводом.',
        metaDescription: 'Ищете английский перевод китайских идиом? Это руководство охватывает 15 самых популярных чэнъюй.',
        keywords: ['китайские идиомы английский перевод', '雪中送炭 значение', '举一反三 значение', '饮水思源 перевод'],
        intro: 'Ищете английский перевод китайских идиом? Это руководство предоставляет точные переводы для самых популярных идиом.',
        category: 'Обучение'
      },
      tl: {
        slug: 'idyoma-ng-tsino-ingles-salin',
        title: '15 Pinaka-hinahanap na Idyoma ng Tsino na may mga Salin sa Ingles',
        description: 'Ang pinaka-hinahanap na idyoma ng Tsino na may tumpak na mga salin sa Ingles.',
        metaDescription: 'Naghahanap ng mga salin sa Ingles ng idyoma ng Tsino? Ang gabay na ito ay sumasaklaw sa 15 pinaka-hinahanap na chengyu.',
        keywords: ['idyoma ng tsino salin ingles', '雪中送炭 kahulugan', '举一反三 kahulugan', '饮水思源 kahulugan'],
        intro: 'Naghahanap ng mga salin sa Ingles ng idyoma ng Tsino? Ang gabay na ito ay nagbibigay ng tumpak na mga salin para sa pinaka-hinahanap na idyoma.',
        category: 'Pagkatuto'
      }
    }
  },
  'classic-chinese-fable-idioms': {
    idiomIds: ['ID074', 'ID042', 'ID234', 'ID271', 'ID200', 'ID079', 'ID135', 'ID225', 'ID249', 'ID233'],
    publishedDate: '2025-02-27',
    translations: {
      ja: {
        slug: 'chuugokugo-guuwa-seigo',
        title: '知っておくべき有名な寓話からの中国語成語10選',
        description: '狐と虎、井戸の中の蛙、切り株のそばでウサギを待つなど、古典的な寓話から生まれた中国語成語を学びましょう。',
        metaDescription: '有名な寓話から生まれた10の中国語成語を発見。狐が虎の威を借りる話や井戸の蛙の物語など、時を超えた教訓を学びましょう。',
        keywords: ['中国語 寓話 成語', '守株待兔 意味', '狐假虎威 意味', '井底之蛙 意味', '叶公好龙 意味', '対牛弾琴 意味', '画蛇添足 意味'],
        intro: '最高の中国語成語は、何千年もの間語り継がれてきた記憶に残る寓話や物語から生まれています。',
        category: '物語と寓話'
      },
      th: {
        slug: 'sam-nuan-jin-nithan-isan',
        title: '10 สำนวนจีนจากนิทานและเรื่องเล่าที่มีชื่อเสียง',
        description: 'เรียนรู้สำนวนจีนจากนิทานคลาสสิก รวมถึงสุนัขจิ้งจอกกับเสือ กบในบ่อ และการรอกระต่ายที่ตอไม้',
        metaDescription: 'ค้นพบ 10 สำนวนจีนจากนิทานที่มีชื่อเสียง เรื่องราวที่สอนบทเรียนเหนือกาลเวลาผ่านเรื่องเล่าที่น่าจดจำ',
        keywords: ['สำนวนจีน นิทาน', '守株待兔 แปล', '狐假虎威 แปล', '井底之蛙 แปล', '叶公好龙 แปล', '对牛弹琴 แปล', '画蛇添足 แปล'],
        intro: 'สำนวนจีนที่ดีที่สุดมาจากนิทานและเรื่องเล่าที่น่าจดจำที่ส่งต่อกันมาหลายพันปี',
        category: 'เรื่องเล่าและนิทาน'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-tu-truyen-co-tich',
        title: '10 Thành Ngữ Tiếng Trung Từ Truyện Ngụ Ngôn Nổi Tiếng',
        description: 'Học thành ngữ tiếng Trung từ các truyện ngụ ngôn cổ điển như cáo mượn oai hùm và ếch ngồi đáy giếng.',
        metaDescription: 'Khám phá 10 thành ngữ tiếng Trung từ truyện ngụ ngôn nổi tiếng. Những câu chuyện dạy bài học vượt thời gian.',
        keywords: ['thành ngữ tiếng trung truyện ngụ ngôn', '守株待兔 là gì', '狐假虎威 là gì', '井底之蛙 là gì', '叶公好龙 là gì'],
        intro: 'Những thành ngữ tiếng Trung hay nhất đến từ những câu chuyện ngụ ngôn đáng nhớ được truyền qua hàng nghìn năm.',
        category: 'Truyện và Ngụ Ngôn'
      },
      ko: {
        slug: 'jungguk-ugwa-seogeo',
        title: '알아야 할 유명한 우화에서 유래한 중국어 성어 10선',
        description: '여우와 호랑이, 우물 안 개구리, 그루터기에서 토끼 기다리기 등 고전 우화에서 유래한 중국어 성어를 배워보세요.',
        metaDescription: '유명한 우화에서 유래한 10가지 중국어 성어를 발견하세요. 시대를 초월한 교훈을 담은 이야기들입니다.',
        keywords: ['중국어 우화 성어', '守株待兔 뜻', '狐假虎威 뜻', '井底之蛙 뜻', '叶公好龙 뜻', '对牛弹琴 뜻'],
        intro: '최고의 중국어 성어는 수천 년 동안 전해 내려온 기억에 남는 우화와 이야기에서 유래합니다.',
        category: '이야기와 우화'
      },
      es: {
        slug: 'modismos-chinos-fabulas-famosas',
        title: '10 Modismos Chinos de Fábulas Famosas que Deberías Conocer',
        description: 'Aprende modismos chinos de fábulas clásicas como el zorro y el tigre, la rana en el pozo y más.',
        metaDescription: 'Descubre 10 modismos chinos de fábulas famosas. Historias que enseñan lecciones atemporales.',
        keywords: ['modismos chinos fábulas', 'shou zhu dai tu significado', 'hu jia hu wei significado', 'jing di zhi wa significado'],
        intro: 'Los mejores modismos chinos provienen de fábulas memorables transmitidas durante miles de años.',
        category: 'Historias y Fábulas'
      },
      fr: {
        slug: 'expressions-chinoises-fables-celebres',
        title: '10 Expressions Chinoises de Fables Célèbres à Connaître',
        description: 'Apprenez des expressions chinoises de fables classiques comme le renard et le tigre, la grenouille dans le puits.',
        metaDescription: 'Découvrez 10 expressions chinoises de fables célèbres. Des histoires qui enseignent des leçons intemporelles.',
        keywords: ['expressions chinoises fables', 'shou zhu dai tu signification', 'hu jia hu wei signification', 'jing di zhi wa signification'],
        intro: 'Les meilleures expressions chinoises proviennent de fables mémorables transmises depuis des milliers d\'années.',
        category: 'Histoires et Fables'
      },
      pt: {
        slug: 'modismos-chineses-fabulas-famosas',
        title: '10 Modismos Chineses de Fábulas Famosas que Você Deve Conhecer',
        description: 'Aprenda modismos chineses de fábulas clássicas como a raposa e o tigre, o sapo no poço.',
        metaDescription: 'Descubra 10 modismos chineses de fábulas famosas. Histórias que ensinam lições atemporais.',
        keywords: ['modismos chineses fábulas', 'shou zhu dai tu significado', 'hu jia hu wei significado', 'jing di zhi wa significado'],
        intro: 'Os melhores modismos chineses vêm de fábulas memoráveis transmitidas por milhares de anos.',
        category: 'Histórias e Fábulas'
      },
      id: {
        slug: 'idiom-cina-dari-dongeng-terkenal',
        title: '10 Idiom Cina dari Dongeng Terkenal yang Harus Anda Ketahui',
        description: 'Pelajari idiom Cina dari dongeng klasik seperti rubah dan harimau, katak di sumur.',
        metaDescription: 'Temukan 10 idiom Cina dari dongeng terkenal. Cerita yang mengajarkan pelajaran abadi.',
        keywords: ['idiom cina dongeng', 'shou zhu dai tu artinya', 'hu jia hu wei artinya', 'jing di zhi wa artinya'],
        intro: 'Idiom Cina terbaik berasal dari dongeng berkesan yang diturunkan selama ribuan tahun.',
        category: 'Cerita dan Dongeng'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-dari-dongeng-terkenal',
        title: '10 Simpulan Bahasa Cina dari Dongeng Terkenal yang Perlu Anda Tahu',
        description: 'Pelajari simpulan bahasa Cina dari dongeng klasik seperti musang dan harimau, katak di perigi.',
        metaDescription: 'Temui 10 simpulan bahasa Cina dari dongeng terkenal. Cerita yang mengajar pengajaran abadi.',
        keywords: ['simpulan bahasa cina dongeng', 'shou zhu dai tu maksud', 'hu jia hu wei maksud', 'jing di zhi wa maksud', '井底之蛙 in chinese'],
        intro: 'Simpulan bahasa Cina terbaik datang dari dongeng yang diingati yang diwarisi selama ribuan tahun.',
        category: 'Cerita dan Dongeng'
      },
      hi: {
        slug: 'prasiddh-kathaon-se-chini-muhavare',
        title: 'प्रसिद्ध कथाओं से 10 चीनी मुहावरे जो आपको जानने चाहिए',
        description: 'लोमड़ी और बाघ, कुएं में मेंढक जैसी क्लासिक कथाओं से चीनी मुहावरे सीखें।',
        metaDescription: 'प्रसिद्ध कथाओं से 10 चीनी मुहावरे खोजें। कहानियां जो कालातीत सबक सिखाती हैं।',
        keywords: ['चीनी मुहावरे कथाएं', '守株待兔 का अर्थ', '狐假虎威 का अर्थ', '井底之蛙 का अर्थ'],
        intro: 'सबसे अच्छे चीनी मुहावरे हजारों वर्षों से चली आ रही यादगार कथाओं से आते हैं।',
        category: 'कहानियां और कथाएं'
      },
      ar: {
        slug: 'taabir-siniya-min-khurufaat-shahira',
        title: '10 تعابير صينية من خرافات شهيرة يجب أن تعرفها',
        description: 'تعلم التعابير الصينية من الخرافات الكلاسيكية مثل الثعلب والنمر، الضفدع في البئر.',
        metaDescription: 'اكتشف 10 تعابير صينية من خرافات شهيرة. قصص تعلم دروساً خالدة.',
        keywords: ['تعابير صينية خرافات', '守株待兔 معنى', '狐假虎威 معنى', '井底之蛙 معنى'],
        intro: 'أفضل التعابير الصينية تأتي من خرافات لا تُنسى توارثتها الأجيال عبر آلاف السنين.',
        category: 'قصص وخرافات'
      },
      ru: {
        slug: 'kitajskie-idiomy-iz-izvestnyh-basen',
        title: '10 Китайских Идиом из Известных Басен, Которые Нужно Знать',
        description: 'Изучите китайские идиомы из классических басен о лисе и тигре, лягушке в колодце.',
        metaDescription: 'Откройте 10 китайских идиом из известных басен. Истории, которые учат вечным урокам.',
        keywords: ['китайские идиомы басни', '守株待兔 значение', '狐假虎威 значение', '井底之蛙 значение'],
        intro: 'Лучшие китайские идиомы происходят из запоминающихся басен, передаваемых тысячелетиями.',
        category: 'Истории и Басни'
      },
      tl: {
        slug: 'idyoma-ng-tsino-mula-sa-mga-pabula',
        title: '10 Idyoma ng Tsino mula sa Mga Sikat na Pabula na Dapat Mong Malaman',
        description: 'Matuto ng idyoma ng Tsino mula sa klasikong pabula tulad ng soro at tigre, palaka sa balon.',
        metaDescription: 'Tuklasin ang 10 idyoma ng Tsino mula sa mga sikat na pabula. Mga kuwentong nagtuturo ng walang hanggang aral.',
        keywords: ['idyoma ng tsino pabula', '守株待兔 kahulugan', '狐假虎威 kahulugan', '井底之蛙 kahulugan'],
        intro: 'Ang pinakamahusay na idyoma ng Tsino ay nagmula sa mga di-malilimutang pabula na ipinasa sa loob ng libu-libong taon.',
        category: 'Mga Kuwento at Pabula'
      }
    }
  },
  'chinese-idioms-preparation-planning': {
    idiomIds: ['ID037', 'ID053', 'ID154', 'ID036', 'ID018', 'ID026', 'ID084', 'ID014'],
    publishedDate: '2025-02-28',
    translations: {
      ja: {
        slug: 'junbi-keikaku-chuugokugo-kotowaza',
        title: '準備と計画に関する中国語成語8選（未雨綢繆）',
        description: '準備の大切さ、先を見通すことの重要性についての賢明な中国語成語。未雨綢繆と関連する成語を学びましょう。',
        metaDescription: '未雨綢繆の意味とは？準備と計画に関する8つの中国語成語を学び、先見の明についての知恵を得ましょう。',
        keywords: ['未雨綢繆 意味', '未雨綢繆 とは', '準備 中国語 成語', '計画 中国語', '胸有成竹 意味', '先見 成語'],
        intro: '未雨綢繆（wèi yǔ chóu móu）とはどういう意味でしょうか？「雨が降る前に屋根を修理する」という意味で、準備と先見の明についての中国の知恵を表しています。',
        category: '戦略'
      },
      th: {
        slug: 'sam-nuan-jin-kiew-kap-kan-triam-tua',
        title: '8 สำนวนจีนเกี่ยวกับการเตรียมตัวและการวางแผน (未雨绸缪)',
        description: 'สำนวนจีนที่ชาญฉลาดเกี่ยวกับการเตรียมพร้อม การวางแผนล่วงหน้า และความสำคัญของการมองการณ์ไกล',
        metaDescription: '未雨绸缪 หมายความว่าอะไร? เรียนรู้ 8 สำนวนจีนเกี่ยวกับการเตรียมตัวและการวางแผน',
        keywords: ['未雨绸缪 แปล', '未雨绸缪 ความหมาย', 'การเตรียมตัว ภาษาจีน', 'การวางแผน สำนวนจีน', '胸有成竹 แปล'],
        intro: '未雨绸缪 (wèi yǔ chóu móu) หมายความว่าอะไร? แปลตรงตัวว่า "ซ่อมหลังคาก่อนฝนตก" สำนวนนี้แสดงถึงภูมิปัญญาจีนเกี่ยวกับการเตรียมตัว',
        category: 'กลยุทธ์'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-ve-su-chuan-bi',
        title: '8 Thành Ngữ Tiếng Trung Về Sự Chuẩn Bị và Lập Kế Hoạch (未雨绸缪)',
        description: 'Những thành ngữ tiếng Trung khôn ngoan về sự chuẩn bị, lập kế hoạch trước và tầm quan trọng của tầm nhìn xa.',
        metaDescription: '未雨绸缪 có nghĩa gì? Học 8 thành ngữ tiếng Trung về sự chuẩn bị và lập kế hoạch.',
        keywords: ['未雨绸缪 là gì', 'chuẩn bị tiếng trung', 'lập kế hoạch thành ngữ tiếng trung', '胸有成竹 là gì'],
        intro: '未雨绸缪 (wèi yǔ chóu móu) có nghĩa gì? Nghĩa đen là "sửa mái trước khi mưa," thành ngữ này thể hiện trí tuệ Trung Hoa về sự chuẩn bị.',
        category: 'Chiến Lược'
      },
      ko: {
        slug: 'junbi-gyehoek-jungguk-seogeo',
        title: '준비와 계획에 관한 중국어 성어 8선 (미우주무)',
        description: '준비의 중요성, 미리 계획하기, 선견지명에 관한 지혜로운 중국어 성어.',
        metaDescription: '미우주무(未雨绸缪)의 의미는? 준비와 계획에 관한 8가지 중국어 성어를 배워보세요.',
        keywords: ['未雨绸缪 뜻', '준비 중국어 성어', '계획 중국어', '胸有成竹 뜻', '선견지명 성어'],
        intro: '미우주무(未雨绸缪)는 무슨 뜻일까요? "비가 오기 전에 지붕을 수리한다"는 의미로, 준비와 선견지명에 관한 중국의 지혜를 담고 있습니다.',
        category: '전략'
      },
      es: {
        slug: 'modismos-chinos-preparacion-planificacion',
        title: '8 Modismos Chinos Sobre Preparación y Planificación (未雨绸缪)',
        description: 'Modismos chinos sabios sobre estar preparado, planificar con anticipación y la importancia de la previsión.',
        metaDescription: '¿Qué significa 未雨绸缪? Aprende 8 modismos chinos sobre preparación y planificación.',
        keywords: ['wei yu chou mou significado', 'modismos chinos preparación', 'planificación chino', '胸有成竹 significado'],
        intro: '¿Qué significa 未雨绸缪 (wèi yǔ chóu móu)? Literalmente "reparar el techo antes de la lluvia," este modismo captura la sabiduría china sobre la preparación.',
        category: 'Estrategia'
      },
      fr: {
        slug: 'expressions-chinoises-preparation-planification',
        title: '8 Expressions Chinoises Sur la Préparation et la Planification (未雨绸缪)',
        description: 'Des expressions chinoises sages sur la préparation, la planification et l\'importance de la prévoyance.',
        metaDescription: 'Que signifie 未雨绸缪? Apprenez 8 expressions chinoises sur la préparation et la planification.',
        keywords: ['wei yu chou mou signification', 'expressions chinoises préparation', 'planification chinois', '胸有成竹 signification'],
        intro: 'Que signifie 未雨绸缪 (wèi yǔ chóu móu)? Littéralement "réparer le toit avant la pluie," cette expression capture la sagesse chinoise sur la préparation.',
        category: 'Stratégie'
      },
      pt: {
        slug: 'modismos-chineses-preparacao-planejamento',
        title: '8 Modismos Chineses Sobre Preparação e Planejamento (未雨绸缪)',
        description: 'Modismos chineses sábios sobre estar preparado, planejar com antecedência e a importância da previsão.',
        metaDescription: 'O que significa 未雨绸缪? Aprenda 8 modismos chineses sobre preparação e planejamento.',
        keywords: ['wei yu chou mou significado', 'modismos chineses preparação', 'planejamento chinês', '胸有成竹 significado'],
        intro: 'O que significa 未雨绸缪 (wèi yǔ chóu móu)? Literalmente "consertar o telhado antes da chuva," este modismo captura a sabedoria chinesa sobre preparação.',
        category: 'Estratégia'
      },
      id: {
        slug: 'idiom-cina-tentang-persiapan-perencanaan',
        title: '8 Idiom Cina Tentang Persiapan dan Perencanaan (未雨绸缪)',
        description: 'Idiom Cina bijak tentang persiapan, perencanaan ke depan, dan pentingnya pandangan ke depan.',
        metaDescription: 'Apa arti 未雨绸缪? Pelajari 8 idiom Cina tentang persiapan dan perencanaan.',
        keywords: ['wei yu chou mou artinya', 'idiom cina persiapan', 'perencanaan cina', '胸有成竹 artinya'],
        intro: 'Apa arti 未雨绸缪 (wèi yǔ chóu móu)? Secara harfiah "memperbaiki atap sebelum hujan," idiom ini menangkap kebijaksanaan Tiongkok tentang persiapan.',
        category: 'Strategi'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-tentang-persediaan',
        title: '8 Simpulan Bahasa Cina Tentang Persediaan dan Perancangan (未雨绸缪)',
        description: 'Simpulan bahasa Cina bijak tentang bersedia, merancang lebih awal, dan kepentingan pandangan jauh.',
        metaDescription: 'Apa maksud 未雨绸缪? Pelajari 8 simpulan bahasa Cina tentang persediaan dan perancangan.',
        keywords: ['wei yu chou mou maksud', 'simpulan bahasa cina persediaan', 'perancangan cina', '胸有成竹 maksud', '未雨绸缪 in chinese'],
        intro: 'Apa maksud 未雨绸缪 (wèi yǔ chóu móu)? Secara literal "membaiki bumbung sebelum hujan," simpulan bahasa ini menangkap kebijaksanaan Cina tentang persediaan.',
        category: 'Strategi'
      },
      hi: {
        slug: 'taiyaari-yojana-chini-muhavare',
        title: 'तैयारी और योजना के बारे में 8 चीनी मुहावरे (未雨绸缪)',
        description: 'तैयार रहने, आगे की योजना बनाने और दूरदर्शिता के महत्व के बारे में बुद्धिमान चीनी मुहावरे।',
        metaDescription: '未雨绸缪 का क्या अर्थ है? तैयारी और योजना के बारे में 8 चीनी मुहावरे सीखें।',
        keywords: ['wei yu chou mou का अर्थ', 'चीनी मुहावरे तैयारी', 'योजना चीनी', '胸有成竹 का अर्थ'],
        intro: '未雨绸缪 (wèi yǔ chóu móu) का क्या अर्थ है? शाब्दिक रूप से "बारिश से पहले छत की मरम्मत करें," यह मुहावरा तैयारी के बारे में चीनी ज्ञान को दर्शाता है।',
        category: 'रणनीति'
      },
      ar: {
        slug: 'taabir-siniya-aan-alistiaedad',
        title: '8 تعابير صينية عن الاستعداد والتخطيط (未雨绸缪)',
        description: 'تعابير صينية حكيمة عن الاستعداد والتخطيط المسبق وأهمية البصيرة.',
        metaDescription: 'ما معنى 未雨绸缪؟ تعلم 8 تعابير صينية عن الاستعداد والتخطيط.',
        keywords: ['wei yu chou mou معنى', 'تعابير صينية استعداد', 'تخطيط صيني', '胸有成竹 معنى'],
        intro: 'ما معنى 未雨绸缪 (wèi yǔ chóu móu)؟ حرفياً "إصلاح السقف قبل المطر"، هذا التعبير يجسد الحكمة الصينية عن الاستعداد.',
        category: 'استراتيجية'
      },
      ru: {
        slug: 'kitajskie-idiomy-o-podgotovke',
        title: '8 Китайских Идиом о Подготовке и Планировании (未雨绸缪)',
        description: 'Мудрые китайские идиомы о подготовке, планировании заранее и важности предвидения.',
        metaDescription: 'Что означает 未雨绸缪? Изучите 8 китайских идиом о подготовке и планировании.',
        keywords: ['wei yu chou mou значение', 'китайские идиомы подготовка', 'планирование китайский', '胸有成竹 значение'],
        intro: 'Что означает 未雨绸缪 (wèi yǔ chóu móu)? Буквально "чинить крышу до дождя", эта идиома отражает китайскую мудрость о подготовке.',
        category: 'Стратегия'
      },
      tl: {
        slug: 'idyoma-ng-tsino-tungkol-sa-paghahanda',
        title: '8 Idyoma ng Tsino Tungkol sa Paghahanda at Pagpaplano (未雨绸缪)',
        description: 'Mga matalinong idyoma ng Tsino tungkol sa pagiging handa, pagpaplano nang maaga, at kahalagahan ng pananaw.',
        metaDescription: 'Ano ang ibig sabihin ng 未雨绸缪? Matuto ng 8 idyoma ng Tsino tungkol sa paghahanda at pagpaplano.',
        keywords: ['wei yu chou mou kahulugan', 'idyoma ng tsino paghahanda', 'pagpaplano tsino', '胸有成竹 kahulugan'],
        intro: 'Ano ang ibig sabihin ng 未雨绸缪 (wèi yǔ chóu móu)? Literal na "ayusin ang bubong bago umulan," ang idyoma na ito ay nagpapakita ng karunungang Tsino tungkol sa paghahanda.',
        category: 'Estratehiya'
      }
    }
  },
  'most-searched-chinese-idioms': {
    idiomIds: ['ID015', 'ID084', 'ID255', 'ID009', 'ID102', 'ID134', 'ID042', 'ID234', 'ID033', 'ID200', 'ID074', 'ID114'],
    publishedDate: '2025-03-01',
    translations: {
      ja: {
        slug: 'ninki-chuugokugo-seigo',
        title: '最も検索される中国語成語12選 - みんなが知りたい人気の成語',
        description: '物極必反、柳暗花明、人山人海など、世界中で最も検索される人気の中国語成語。',
        metaDescription: '最も検索される中国語成語は？物極必反から人山人海まで、世界中の学習者が検索する12の人気成語を学びましょう。',
        keywords: ['人気 中国語 成語', '物極必反 意味', '物極必反 とは', '柳暗花明 意味', '柳暗花明 とは', '人山人海 意味', '水滴石穿 意味', '明鏡止水 意味'],
        intro: '世界で最も検索される中国語成語は何でしょうか？検索データに基づき、文化を超えて共鳴する普遍的なテーマを持つ12の成語を紹介します。',
        category: '人気'
      },
      th: {
        slug: 'sam-nuan-jin-yod-niyom',
        title: '12 สำนวนจีนที่ค้นหามากที่สุด - สำนวนยอดนิยมที่ทุกคนอยากรู้',
        description: 'สำนวนจีนที่ค้นหาบ่อยที่สุด รวมถึง 物极必反, 柳暗花明, 人山人海 และอื่นๆ',
        metaDescription: 'สำนวนจีนที่ค้นหามากที่สุดคืออะไร? จาก 物极必反 ถึง 人山人海 เรียนรู้ 12 สำนวนยอดนิยม',
        keywords: ['สำนวนจีน ยอดนิยม', '物极必反 แปล', '柳暗花明 แปล', '人山人海 แปล', '水滴石穿 แปล', '明镜止水 แปล'],
        intro: 'สำนวนจีนที่ค้นหามากที่สุดในโลกคืออะไร? จากข้อมูลการค้นหา สำนวน 12 สำนวนนี้มีธีมสากลที่โดนใจข้ามวัฒนธรรม',
        category: 'ยอดนิยม'
      },
      vi: {
        slug: 'thanh-ngu-tieng-trung-pho-bien-nhat',
        title: '12 Thành Ngữ Tiếng Trung Được Tìm Kiếm Nhiều Nhất',
        description: 'Những thành ngữ tiếng Trung phổ biến nhất bao gồm 物极必反, 柳暗花明, 人山人海 và nhiều hơn nữa.',
        metaDescription: 'Thành ngữ tiếng Trung nào được tìm kiếm nhiều nhất? Từ 物极必反 đến 人山人海 - học 12 thành ngữ phổ biến nhất.',
        keywords: ['thành ngữ tiếng trung phổ biến', '物极必反 là gì', '柳暗花明 là gì', '人山人海 là gì', '水滴石穿 là gì'],
        intro: 'Thành ngữ tiếng Trung nào được tìm kiếm nhiều nhất trên thế giới? Dựa trên dữ liệu tìm kiếm, 12 thành ngữ này có chủ đề phổ quát vượt qua các nền văn hóa.',
        category: 'Phổ Biến'
      },
      ko: {
        slug: 'ingi-jungguk-seogeo',
        title: '가장 많이 검색되는 중국어 성어 12선 - 모두가 알고 싶어하는 인기 성어',
        description: '물극필반, 유암화명, 인산인해 등 세계에서 가장 많이 검색되는 인기 중국어 성어.',
        metaDescription: '가장 많이 검색되는 중국어 성어는? 물극필반부터 인산인해까지 - 전 세계 학습자들이 검색하는 12가지 인기 성어.',
        keywords: ['인기 중국어 성어', '物极必反 뜻', '柳暗花明 뜻', '人山人海 뜻', '水滴石穿 뜻', '明镜止水 뜻'],
        intro: '세계에서 가장 많이 검색되는 중국어 성어는 무엇일까요? 검색 데이터를 바탕으로 문화를 초월해 공감을 얻는 12가지 성어를 소개합니다.',
        category: '인기'
      },
      es: {
        slug: 'modismos-chinos-mas-buscados',
        title: '12 Modismos Chinos Más Buscados - Los Chengyu Más Populares',
        description: 'Los modismos chinos más buscados incluyendo wu ji bi fan, liu an hua ming, ren shan ren hai y más.',
        metaDescription: '¿Cuáles son los modismos chinos más buscados? Desde los extremos llevan a la reversión hasta montaña de personas mar de personas.',
        keywords: ['modismos chinos más populares', 'wu ji bi fan significado', 'liu an hua ming significado', 'ren shan ren hai significado'],
        intro: '¿Cuáles son los modismos chinos más buscados en el mundo? Basado en datos de búsqueda, estos 12 chengyu capturan temas universales.',
        category: 'Popular'
      },
      fr: {
        slug: 'expressions-chinoises-les-plus-recherchees',
        title: '12 Expressions Chinoises Les Plus Recherchées - Les Chengyu Populaires',
        description: 'Les expressions chinoises les plus recherchées incluant wu ji bi fan, liu an hua ming, ren shan ren hai et plus.',
        metaDescription: 'Quelles sont les expressions chinoises les plus recherchées? Des extrêmes mènent au renversement à montagne de gens mer de gens.',
        keywords: ['expressions chinoises populaires', 'wu ji bi fan signification', 'liu an hua ming signification', 'ren shan ren hai signification'],
        intro: 'Quelles sont les expressions chinoises les plus recherchées dans le monde? Basé sur les données de recherche, ces 12 chengyu capturent des thèmes universels.',
        category: 'Populaire'
      },
      pt: {
        slug: 'modismos-chineses-mais-pesquisados',
        title: '12 Modismos Chineses Mais Pesquisados - Os Chengyu Mais Populares',
        description: 'Os modismos chineses mais pesquisados incluindo wu ji bi fan, liu an hua ming, ren shan ren hai e mais.',
        metaDescription: 'Quais são os modismos chineses mais pesquisados? De extremos levam à reversão a montanha de pessoas mar de pessoas.',
        keywords: ['modismos chineses mais populares', 'wu ji bi fan significado', 'liu an hua ming significado', 'ren shan ren hai significado'],
        intro: 'Quais são os modismos chineses mais pesquisados no mundo? Com base em dados de pesquisa, esses 12 chengyu capturam temas universais.',
        category: 'Popular'
      },
      id: {
        slug: 'idiom-cina-paling-dicari',
        title: '12 Idiom Cina Paling Dicari - Chengyu Populer yang Semua Orang Ingin Tahu',
        description: 'Idiom Cina paling dicari termasuk wu ji bi fan, liu an hua ming, ren shan ren hai dan lainnya.',
        metaDescription: 'Apa idiom Cina yang paling dicari? Dari ekstrem mengarah ke pembalikan hingga gunung orang laut orang.',
        keywords: ['idiom cina paling populer', 'wu ji bi fan artinya', 'liu an hua ming artinya', 'ren shan ren hai artinya'],
        intro: 'Apa idiom Cina yang paling dicari di dunia? Berdasarkan data pencarian, 12 chengyu ini menangkap tema universal.',
        category: 'Populer'
      },
      ms: {
        slug: 'simpulan-bahasa-cina-paling-dicari',
        title: '12 Simpulan Bahasa Cina Paling Dicari - Chengyu Popular',
        description: 'Simpulan bahasa Cina paling dicari termasuk wu ji bi fan, liu an hua ming, ren shan ren hai dan lain-lain.',
        metaDescription: 'Apakah simpulan bahasa Cina paling dicari? Dari ekstrem membawa kepada pembalikan hingga gunung orang laut orang.',
        keywords: ['simpulan bahasa cina popular', 'wu ji bi fan maksud', 'liu an hua ming maksud', 'ren shan ren hai maksud', 'people mountain people sea in chinese'],
        intro: 'Apakah simpulan bahasa Cina paling dicari di dunia? Berdasarkan data carian, 12 chengyu ini menangkap tema universal.',
        category: 'Popular'
      },
      hi: {
        slug: 'sabse-jyada-khoje-jane-wale-chini-muhavare',
        title: 'सबसे अधिक खोजे जाने वाले 12 चीनी मुहावरे - लोकप्रिय चेंग्यू',
        description: 'सबसे अधिक खोजे जाने वाले चीनी मुहावरे जिनमें wu ji bi fan, liu an hua ming, ren shan ren hai और अधिक शामिल हैं।',
        metaDescription: 'सबसे अधिक खोजे जाने वाले चीनी मुहावरे कौन से हैं? चरम सीमाएं उलटाव की ओर ले जाती हैं से लेकर लोगों का पहाड़ लोगों का समुद्र तक।',
        keywords: ['लोकप्रिय चीनी मुहावरे', 'wu ji bi fan का अर्थ', 'liu an hua ming का अर्थ', 'ren shan ren hai का अर्थ'],
        intro: 'दुनिया में सबसे अधिक खोजे जाने वाले चीनी मुहावरे कौन से हैं? खोज डेटा के आधार पर, ये 12 चेंग्यू सार्वभौमिक विषयों को दर्शाते हैं।',
        category: 'लोकप्रिय'
      },
      ar: {
        slug: 'akthar-altaabir-alsiniya-bahathan',
        title: '12 تعبيراً صينياً الأكثر بحثاً - التشينغيو الشائعة',
        description: 'التعابير الصينية الأكثر بحثاً بما في ذلك wu ji bi fan, liu an hua ming, ren shan ren hai والمزيد.',
        metaDescription: 'ما هي التعابير الصينية الأكثر بحثاً؟ من التطرف يؤدي إلى الانعكاس إلى جبل من الناس بحر من الناس.',
        keywords: ['تعابير صينية شائعة', 'wu ji bi fan معنى', 'liu an hua ming معنى', 'ren shan ren hai معنى'],
        intro: 'ما هي التعابير الصينية الأكثر بحثاً في العالم؟ بناءً على بيانات البحث، تجسد هذه التعابير الاثني عشر موضوعات عالمية.',
        category: 'شائع'
      },
      ru: {
        slug: 'samye-populyarnye-kitajskie-idiomy',
        title: '12 Самых Популярных Китайских Идиом - Чэнъюй, Которые Все Хотят Знать',
        description: 'Самые популярные китайские идиомы, включая wu ji bi fan, liu an hua ming, ren shan ren hai и другие.',
        metaDescription: 'Какие китайские идиомы ищут чаще всего? От крайности ведут к обратному до гора людей море людей.',
        keywords: ['популярные китайские идиомы', 'wu ji bi fan значение', 'liu an hua ming значение', 'ren shan ren hai значение', 'people mountain people sea'],
        intro: 'Какие китайские идиомы ищут чаще всего в мире? На основе данных поиска, эти 12 чэнъюй отражают универсальные темы.',
        category: 'Популярное'
      },
      tl: {
        slug: 'pinakahinahanap-na-idyoma-ng-tsino',
        title: '12 Pinakahinahanap na Idyoma ng Tsino - Mga Sikat na Chengyu',
        description: 'Ang pinakahinahanap na idyoma ng Tsino kasama ang wu ji bi fan, liu an hua ming, ren shan ren hai at higit pa.',
        metaDescription: 'Ano ang pinakahinahanap na idyoma ng Tsino? Mula sa mga sukdulan ay humahantong sa pagbaliktad hanggang sa bundok ng tao dagat ng tao.',
        keywords: ['sikat na idyoma ng tsino', 'wu ji bi fan kahulugan', 'liu an hua ming kahulugan', 'ren shan ren hai kahulugan'],
        intro: 'Ano ang pinakahinahanap na idyoma ng Tsino sa mundo? Batay sa data ng paghahanap, ang 12 chengyu na ito ay nagpapakita ng mga pangkalahatang tema.',
        category: 'Sikat'
      }
    }
  }
};

// Add the new listicles to each language file
function addNewListiclesToLanguage(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, lang, 'listicles.json');

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${lang}: file not found`);
    return;
  }

  console.log(`Adding new listicles to ${lang}...`);

  let listicles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Check which listicles already exist
  const existingSlugs = new Set(listicles.map(l => l.originalSlug));

  let added = 0;
  for (const [originalSlug, data] of Object.entries(newListicles)) {
    if (existingSlugs.has(originalSlug)) {
      console.log(`  Skipping ${originalSlug} (already exists)`);
      continue;
    }

    const translation = data.translations[lang];
    if (!translation) {
      console.log(`  No translation for ${originalSlug} in ${lang}`);
      continue;
    }

    const newListicle = {
      slug: translation.slug,
      originalSlug: originalSlug,
      title: translation.title,
      description: translation.description,
      metaDescription: translation.metaDescription,
      keywords: translation.keywords,
      intro: translation.intro,
      idiomIds: data.idiomIds,
      category: translation.category,
      publishedDate: data.publishedDate
    };

    listicles.push(newListicle);
    added++;
  }

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(listicles, null, 2), 'utf-8');
  console.log(`  Added ${added} new listicles (total: ${listicles.length})`);
}

// Main execution
console.log('Adding new listicle translations...\n');

const languages = ['ar', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ms', 'pt', 'ru', 'th', 'tl', 'vi'];

languages.forEach(lang => {
  try {
    addNewListiclesToLanguage(lang);
  } catch (err) {
    console.error(`Error processing ${lang}:`, err.message);
  }
});

console.log('\nDone!');
