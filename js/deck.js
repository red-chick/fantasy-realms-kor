var deck = {
  cards: [{
      id: 1,
      suit: 'land',
      name: '산',
      strength: 9,
      bonus: '<span class="weather">연기</span>와 <span class="flame">들불</span>이 모두 있으면 +50. <br />모든 <span class="flood">물</span>의 패널티 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('연기') && hand.contains('들불') ? 50 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Flood';
      },
      relatedSuits: ['Flood'],
      relatedCards: ['연기', '들불']
    },
    {
      id: 2,
      suit: 'land',
      name: '동굴',
      strength: 6,
      bonus: '<span class="army">드워프 보병대</span>, <span class="beast">용</span> 중 하나라도 있으면 +25. <br />모든 <span class="weather">날씨</span>의 패널티 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('드워프 보병대') || hand.contains('용') ? 25 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Weather';
      },
      relatedSuits: ['Weather'],
      relatedCards: ['드워프 보병대', '용']
    },
    {
      id: 3,
      suit: 'land',
      name: '종탑',
      strength: 8,
      bonus: '<span class="wizard">마법사</span>가 하나라도 있으면 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Wizard') ? 15 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 4,
      suit: 'land',
      name: '숲',
      strength: 7,
      bonus: '<span class="beast">야수</span> 1장동 +12. <span class="army">엘프 궁수대</span>가 있으면 +12.',
      penalty: null,
      bonusScore: function(hand) {
        return 12 * hand.countSuit('Beast') + (hand.contains('엘프 궁수대') ? 12 : 0);
      },
      relatedSuits: ['Beast'],
      relatedCards: ['엘프 궁수대']
    },
    {
      id: 5,
      suit: 'land',
      name: '대지의 정령',
      strength: 4,
      bonus: '다른 <span class="land">땅</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('land', this.id);
      },
      relatedSuits: ['land'],
      relatedCards: []
    },
    {
      id: 6,
      suit: 'Flood',
      name: '생명의 샘',
      strength: 1,
      bonus: '가지고 있는 <span class="weapon">무기</span>, <span class="flood">물</span>, <span class="flame">불</span>, <span class="land">땅</span> or <span class="weather">날씨</span> 중 1장의 기본 힘 더하기.',
      penalty: null,
      bonusScore: function(hand) {
        var max = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'land' || card.suit === 'Weather') {
            if (card.strength > max) {
              max = card.strength;
            }
          }
        }
        return max;
      },
      relatedSuits: ['Weapon', 'Flood', 'Flame', 'land', 'Weather'],
      relatedCards: []
    },
    {
      id: 7,
      suit: 'Flood',
      name: '늪',
      strength: 18,
      bonus: null,
      penalty: '<span class="army">군대</span>와 <span class="flame">불</span> 1장당 -3.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Flame');
        if (!(hand.containsId(25) || hand.containsId(41))) { // these clear the word 'Army' from the penalty
          penaltyCards += hand.countSuit('Army');
        }
        return -3 * penaltyCards;
      },
      relatedSuits: ['Army', 'Flame'],
      relatedCards: []
    },
    {
      id: 8,
      suit: 'Flood',
      name: '대홍수',
      strength: 32,
      bonus: null,
      penalty: '모든 <span class="army">군대</span> 무효, 모든 <span class="land">땅</span> 무효 (<span class="land">산</span> 예외), 모든 <span class="flame">불</span> 무효 (<span class="flame">번개</span> 예외).',
      blanks: function(card, hand) {
        return (card.suit === 'Army' && !(hand.containsId(25) || hand.containsId(41))) || // these clear the word 'Army' from the penalty
          (card.suit === 'land' && card.name !== '산') ||
          (card.suit === 'Flame' && card.name !== '번개');
      },
      relatedSuits: ['Army', 'land', 'Flame'],
      relatedCards: ['산', '번개']
    },
    {
      id: 9,
      suit: 'Flood',
      name: '섬',
      strength: 14,
      bonus: '<span class="flood">물</span>이나 <span class="flame">불</span> 중 1장의 패널티를 제거.',
      penalty: null,
      action: '물이나 불 중 1장의 패널티를 제거.',
      relatedSuits: ['Flood', 'Flame'],
      relatedCards: []
    },
    {
      id: 10,
      suit: 'Flood',
      name: '물의 정령',
      strength: 4,
      bonus: '다른 <span class="flood">물</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Flood', this.id);
      },
      relatedSuits: ['Flood'],
      relatedCards: []
    },
    {
      id: 11,
      suit: 'Weather',
      name: '폭풍우',
      strength: 8,
      bonus: '<span class="flood">물</span> 1장당 +10.',
      penalty: '모든 <span class="flame">불</span> (<span class="flame">번개</span> 예외) 무효.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Flood');
      },
      blanks: function(card, hand) {
        return card.suit === 'Flame' && card.name !== '번개';
      },
      relatedSuits: ['Flood', 'Flame'],
      relatedCards: ['번개']
    },
    {
      id: 12,
      suit: 'Weather',
      name: '눈보라',
      strength: 30,
      bonus: null,
      penalty: '모든 <span class="flood">물</span> 무효. <br /><span class="army">군대</span>, <span class="leader">지도자</span>, <span class="beast">야수</span>, <span class="flame">불</span> 1장당 -5.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Leader') + hand.countSuit('Beast') + hand.countSuit('Flame');
        if (!hand.containsId(25)) { // clears the word 'Army' from the penalty
          penaltyCards += hand.countSuit('Army');
        }
        return -5 * penaltyCards;
      },
      blanks: function(card, hand) {
        return card.suit === 'Flood';
      },
      relatedSuits: ['Leader', 'Beast', 'Flame', 'Army', 'Flood'],
      relatedCards: []
    },
    {
      id: 13,
      suit: 'Weather',
      name: '연기',
      strength: 27,
      bonus: null,
      penalty: '<span class="flame">불</span>이 하나도 없으면 이 카드는 무효.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Flame');
      },
      relatedSuits: ['Flame'],
      relatedCards: []
    },
    {
      id: 14,
      suit: 'Weather',
      name: '회오리바람',
      strength: 13,
      bonus: '<span class="weather">폭풍우</span>가 있고 <span class="weather">눈보라</span>, <span class="flood">대홍수</span> 중 하나라도 있으면 +40.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('폭풍우') && (hand.contains('눈보라') || hand.contains('대홍수')) ? 40 : 0;
      },
      relatedSuits: ['폭풍우'],
      relatedCards: ['눈보라', '대홍수']
    },
    {
      id: 15,
      suit: 'Weather',
      name: '대기의 정령',
      strength: 4,
      bonus: '+15 for each other <span class="weather">Weather</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Weather', this.id);
      },
      relatedSuits: ['Weather'],
      relatedCards: []
    },
    {
      id: 16,
      suit: 'Flame',
      name: '들불',
      strength: 40,
      bonus: null,
      penalty: '모든 카드 무효. <span class="flame">불</span>, <span class="wizard">마법사</span>, <span class="weather">날씨</span>, <span class="weapon">무기</span>, <span class="artifact">유물</span>, <span class="land">산</span>, <span class="flood">대홍수</span>, <span class="flood">섬</span>, <span class="beast">유니콘</span>, <span class="beast">용</span> 예외.',
      blanks: function(card, hand) {
        return !(card.suit === 'Flame' || card.suit === 'Wizard' || card.suit === 'Weather' ||
          card.suit === 'Weapon' || card.suit === 'Artifact' || card.suit === 'Wild' || card.name === '산' ||
          card.name === '대홍수' || card.name === '섬' || card.name === '유니콘' || card.name === '용');
      },
      relatedSuits: allSuits(),
      relatedCards: ['산', '대홍수', '섬', '유니콘', '용']
    },
    {
      id: 17,
      suit: 'Flame',
      name: 'Candle',
      strength: 2,
      bonus: '+100 with <span class="artifact">Book of Changes</span>, <span class="land">종탑</span>, and any one <span class="wizard">마법사</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Book of Changes') && hand.contains('종탑') && hand.containsSuit('Wizard') ? 100 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: ['Book of Changes', '종탑']
    },
    {
      id: 18,
      suit: 'Flame',
      name: 'Forge',
      strength: 9,
      bonus: '+9 for each <span class="weapon">Weapon</span> and <span class="artifact">Artifact</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * (hand.countSuit('Weapon') + hand.countSuit('Artifact'));
      },
      relatedSuits: ['Weapon', 'Artifact'],
      relatedCards: []
    },
    {
      id: 19,
      suit: 'Flame',
      name: 'Lightning',
      strength: 11,
      bonus: '+30 with <span class="weather">Rainstorm</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('폭풍우') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['폭풍우']
    },
    {
      id: 20,
      suit: 'Flame',
      name: 'Fire Elemental',
      strength: 4,
      bonus: '+15 for each other <span class="flame">Flame</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Flame', this.id);
      },
      relatedSuits: ['Flame'],
      relatedCards: []
    },
    {
      id: 21,
      suit: 'Army',
      name: 'Knights',
      strength: 20,
      bonus: null,
      penalty: '-8 unless with at least one <span class="leader">Leader</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Leader') ? 0 : -8;
      },
      relatedSuits: ['Leader'],
      relatedCards: []
    },
    {
      id: 22,
      suit: 'Army',
      name: '엘프 궁수대',
      strength: 10,
      bonus: '+5 if no <span class="weather">Weather</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Weather') ? 0 : 5;
      },
      relatedSuits: ['Weather'],
      relatedCards: []
    },
    {
      id: 23,
      suit: 'Army',
      name: 'Light Cavalry',
      strength: 17,
      bonus: null,
      penalty: '-2 for each <span class="land">땅</span>.',
      penaltyScore: function(hand) {
        return -2 * hand.countSuit('land');
      },
      relatedSuits: ['land'],
      relatedCards: []

    },
    {
      id: 24,
      suit: 'Army',
      name: '드워프 보병대',
      strength: 15,
      bonus: null,
      penalty: '-2 for each other <span class="army">Army</span>.',
      penaltyScore: function(hand) {
        if (!hand.containsId(25)) { // clears the word 'Army' from the penalty
          return -2 * hand.countSuitExcluding('Army', this.id);
        }
        return 0;
      },
      relatedSuits: ['Army'],
      relatedCards: []
    },
    {
      id: 25,
      suit: 'Army',
      name: 'Rangers',
      strength: 5,
      bonus: '+10 for each <span class="land">땅</span>. <br />CLEARS the word <span class="army">Army</span> from all Penalties.',
      penalty: null,
      bonusScore: function(hand) {
        return 10 * hand.countSuit('land');
      },
      relatedSuits: ['land', 'Army'],
      relatedCards: []
    },
    {
      id: 26,
      suit: 'Wizard',
      name: 'Collector',
      strength: 7,
      bonus: '+10 if three different cards in same suit, +40 if four different cards in same suit, +100 if five different cards in same suit.',
      penalty: null,
      bonusScore: function(hand) {
        var bySuit = {};
        for (const card of hand.nonBlankedCards()) {
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
        var bonus = 0;
        for (const suit of Object.values(bySuit)) {
          var count = Object.keys(suit).length;
          if (count === 3) {
            bonus += 10;
          } else if (count === 4) {
            bonus += 40;
          } else if (count >= 5) {
            bonus += 100;
          }
        }
        return bonus;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 27,
      suit: 'Wizard',
      name: 'Beastmaster',
      strength: 9,
      bonus: '+9 for each <span class="beast">Beast</span>. <br />CLEARS the Penalty on all <span class="beast">Beasts</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * hand.countSuit('Beast');
      },
      clearsPenalty: function(card) {
        return card.suit === 'Beast';
      },
      relatedSuits: ['Beast'],
      relatedCards: []
    },
    {
      id: 28,
      suit: 'Wizard',
      name: 'Necromancer',
      strength: 3,
      bonus: 'At the end of the game, you may take one <span class="army">Army</span>, <span class="leader">Leader</span>, <span class="wizard">마법사</span>, or <span class="beast">Beast</span> from the discard pile and add it to your hand as an eighth card.',
      penalty: null,
      relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast'],
      relatedCards: []
    },
    {
      id: 29,
      suit: 'Wizard',
      name: 'Warlock Lord',
      strength: 25,
      bonus: null,
      penalty: '-10 for each <span class="leader">Leader</span> and other <span class="wizard">마법사</span>.',
      penaltyScore: function(hand) {
        return -10 * (hand.countSuit('Leader') + hand.countSuitExcluding('Wizard', this.id));
      },
      relatedSuits: ['Leader', 'Wizard'],
      relatedCards: []
    },
    {
      id: 30,
      suit: 'Wizard',
      name: 'Enchantress',
      strength: 5,
      bonus: '+5 for each <span class="land">땅</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span>, and <span class="flame">Flame</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 5 * (hand.countSuit('land') + hand.countSuit('Weather') + hand.countSuit('Flood') + hand.countSuit('Flame'));
      },
      relatedSuits: ['land', 'Weather', 'Flood', 'Flame'],
      relatedCards: []
    },
    {
      id: 31,
      suit: 'Leader',
      name: 'King',
      strength: 8,
      bonus: '+5 for each <span class="army">Army</span>. <br />OR +20 for each <span class="army">Army</span> if with <span class="leader">Queen</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('Queen') ? 20 : 5) * hand.countSuit('Army');
      },
      relatedSuits: ['Army'],
      relatedCards: ['Queen']
    },
    {
      id: 32,
      suit: 'Leader',
      name: 'Queen',
      strength: 6,
      bonus: '+5 for each <span class="army">Army</span>. <br />OR +20 for each <span class="army">Army</span> if with <span class="leader">King</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('King') ? 20 : 5) * hand.countSuit('Army');
      },
      relatedSuits: ['Army'],
      relatedCards: ['King']
    },
    {
      id: 33,
      suit: 'Leader',
      name: 'Princess',
      strength: 2,
      bonus: '+8 for each <span class="army">Army</span>, <span class="wizard">마법사</span>, and other <span class="leader">Leader</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return 8 * (hand.countSuit('Army') + hand.countSuit('Wizard') + hand.countSuitExcluding('Leader', this.id));
      },
      relatedSuits: ['Army', 'Wizard', 'Leader'],
      relatedCards: []
    },
    {
      id: 34,
      suit: 'Leader',
      name: 'Warlord',
      strength: 4,
      bonus: 'The sum of the base strength of all <span class="army">Armies</span>.',
      penalty: null,
      bonusScore: function(hand) {
        var total = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Army') {
            total += card.strength;
          }
        }
        return total;
      },
      relatedSuits: ['Army'],
      relatedCards: []
    },
    {
      id: 35,
      suit: 'Leader',
      name: 'Empress',
      strength: 15,
      bonus: '+10 for each <span class="army">Army</span>.',
      penalty: '-5 for each other <span class="leader">Leader</span>.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Army');
      },
      penaltyScore: function(hand) {
        return -5 * hand.countSuitExcluding('Leader', this.id);
      },
      relatedSuits: ['Army', 'Leader'],
      relatedCards: []
    },
    {
      id: 36,
      suit: 'Beast',
      name: '유니콘',
      strength: 9,
      bonus: '+30 with <span class="leader">Princess</span>. <br />OR +15 with <span class="leader">Empress</span>, <span class="leader">Queen</span>, or <span class="leader">Enchantress</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Princess') ? 30 : (hand.contains('Empress') || hand.contains('Queen') || hand.contains('Enchantress')) ? 15 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
    },
    {
      id: 37,
      suit: 'Beast',
      name: 'Basilisk',
      strength: 35,
      bonus: null,
      penalty: 'BLANKS all <span class="army">Armies</span>, <span class="leader">Leaders</span>, and other <span class="beast">Beasts</span>.',
      blanks: function(card, hand) {
        return (card.suit === 'Army' && !hand.containsId(25)) || // clears the word 'Army' from the penalty
          card.suit === 'Leader' ||
          (card.suit === 'Beast' && card.id !== this.id);
      },
      relatedSuits: ['Army', 'Leader', 'Beast'],
      relatedCards: []
    },
    {
      id: 38,
      suit: 'Beast',
      name: 'Warhorse',
      strength: 6,
      bonus: '+14 with any <span class="leader">Leader</span> or <span class="wizard">마법사</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') || hand.containsSuit('Wizard') ? 14 : 0;
      },
      relatedSuits: ['Leader', 'Wizard'],
      relatedCards: []
    },
    {
      id: 39,
      suit: 'Beast',
      name: '용',
      strength: 30,
      bonus: null,
      penalty: '-40 unless with at least one <span class="wizard">마법사</span>.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Wizard') ? 0 : -40;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 40,
      suit: 'Beast',
      name: 'Hydra',
      strength: 12,
      bonus: '+28 with <span class="flood">Swamp</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('Swamp') ? 28 : 0;
      },
      relatedSuits: [],
      relatedCards: ['Swamp']
    },
    {
      id: 41,
      suit: 'Weapon',
      name: 'Warship',
      strength: 23,
      bonus: 'CLEARS the word <span class="army">Army</span> from all Penalties of all <span class="flood">Floods</span>.',
      penalty: 'BLANKED unless with at least one <span class="flood">Flood</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Flood');
      },
      relatedSuits: ['Army', 'Flood'],
      relatedCards: []
    },
    {
      id: 42,
      suit: 'Weapon',
      name: 'Magic Wand',
      strength: 1,
      bonus: '+25 with any one <span class="wizard">마법사</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Wizard') ? 25 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 43,
      suit: 'Weapon',
      name: 'Sword of Keth',
      strength: 7,
      bonus: '+10 with any one <span class="leader">Leader</span>. <br />OR +40 with both <span class="leader">Leader</span> and <span class="artifact">Shield of Keth</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') ? (hand.contains('Shield of Keth') ? 40 : 10) : 0;
      },
      relatedSuits: ['Leader'],
      relatedCards: ['Shield of Keth']
    },
    {
      id: 44,
      suit: 'Weapon',
      name: 'Elven Longbow',
      strength: 3,
      bonus: '+30 with <span class="army">엘프 궁수대</span>, <span class="leader">Warlord</span> or <span class="wizard">Beastmaster</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('엘프 궁수대') || hand.contains('Warlord') || hand.contains('Beastmaster') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['엘프 궁수대', 'Warlord', 'Beastmaster']
    },
    {
      id: 45,
      suit: 'Weapon',
      name: 'War Dirigible',
      strength: 35,
      bonus: null,
      penalty: 'BLANKED unless with at least one <span class="army">Army</span>. <br />BLANKED with any <span class="weather">Weather</span>.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Army') || hand.containsSuit('Weather');
      },
      relatedSuits: ['Army', 'Weather'],
      relatedCards: []
    },
    {
      id: 46,
      suit: 'Artifact',
      name: 'Shield of Keth',
      strength: 4,
      bonus: '+15 with any one <span class="leader">Leader</span>. <br />OR +40 with both <span class="leader">Leader</span> and <span class="weapon">Sword of Keth</span>.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') ? (hand.contains('Sword of Keth') ? 40 : 15) : 0;
      },
      relatedSuits: ['Leader'],
      relatedCards: ['Sword of Keth']
    },
    {
      id: 47,
      suit: 'Artifact',
      name: 'Gem of Order',
      strength: 5,
      bonus: '+10 for 3-card run, +30 for 4-card run, +60 for 5-card run, +100 for 6-card run, +150 for 7-card run. <br />(This refers to the base strength numbers.)',
      penalty: null,
      bonusScore: function(hand) {
        var strengths = hand.nonBlankedCards().map(card => card.strength);
        var currentRun = 0;
        var runs = [];
        for (var i = 0; i <= 40; i++) {
          if (strengths.includes(i)) {
            currentRun++;
          } else {
            runs.push(currentRun);
            currentRun = 0;
          }
        }
        var bonus = 0;
        for (var run of runs) {
          if (run === 3) {
            bonus += 10;
          } else if (run === 4) {
            bonus += 30;
          } else if (run === 5) {
            bonus += 60;
          } else if (run === 6) {
            bonus += 100;
          } else if (run >= 7) {
            bonus += 150;
          }
        }
        return bonus;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 48,
      suit: 'Artifact',
      name: 'World Tree',
      strength: 2,
      bonus: '+50 if every non-BLANKED card is a different suit.',
      penalty: null,
      bonusScore: function(hand) {
        var suits = [];
        for (const card of hand.nonBlankedCards()) {
          if (suits.includes(card.suit)) {
            return 0;
          }
          suits.push(card.suit);
        }
        return 50;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 49,
      suit: 'Artifact',
      name: 'Book of Changes',
      strength: 3,
      bonus: 'You may change the suit of one other card. Its name, bonuses and penalties remain the same.',
      penalty: null,
      action: 'Pick a suit and a target card from your hand.',
      relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
      relatedCards: []
    },
    {
      id: 50,
      suit: 'Artifact',
      name: 'Protection Rune',
      strength: 1,
      bonus: 'CLEARS the Penalty on all cards.',
      penalty: null,
      clearsPenalty: function(card) {
        return true;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 51,
      suit: 'Wild',
      name: 'Shapeshifter',
      strength: 0,
      bonus: '<b>Shapeshifter</b> may duplicate the name and suit of any one <span class="artifact">Artifact</span>, <span class="leader">Leader</span>, <span class="wizard">마법사</span>, <span class="weapon">Weapon</span> or <span class="beast">Beast</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
      penalty: null,
      action: 'Pick a target card to duplicate.',
      relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast'].sort(),
      relatedCards: []
    },
    {
      id: 52,
      suit: 'Wild',
      name: 'Mirage',
      strength: 0,
      bonus: '<b>Mirage</b> may duplicate the name and suit of any one <span class="army">Army</span>, <span class="land">땅</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span> or <span class="flame">Flame</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
      penalty: null,
      action: 'Pick a target card to duplicate.',
      relatedSuits: ['Army', 'land', 'Weather', 'Flood', 'Flame'].sort(),
      relatedCards: []
    },
    {
      id: 53,
      suit: 'Wild',
      name: 'Doppelgänger',
      strength: 0,
      bonus: '<b>Doppelgänger</b> may duplicate the name, base strength, suit, and penalty BUT NOT BONUS of any one other card in your hand.',
      penalty: null,
      action: 'Pick a card from your hand to duplicate.',
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 54,
      suit: 'Wizard',
      name: 'Jester',
      strength: 3,
      bonus: '+3 for each other card with an odd base value. <br />OR +50 if entire hand has odd base values.',
      penalty: null,
      bonusScore: function(hand) {
        var oddCount = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.strength % 2 === 1) {
            oddCount++;
          }
        }
        if (oddCount === hand.size()) {
          return 50;
        } else {
          return (oddCount - 1) * 3;
        }
      },
      relatedSuits: [],
      relatedCards: []
    }
  ],
  getCardByName: function(cardName) {
    for (const card of this.cards) {
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    return this.cards[id - 1];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const card of this.cards) {
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    Object.keys(cardsBySuit).sort().forEach(function(key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  }
};

function allSuits() {
  return ['land', 'Flood', 'Weather', 'Flame', 'Army', 'Wizard', 'Leader', 'Beast', 'Weapon', 'Artifact', 'Wild'].sort();
}

var NONE = -1;
var ISLAND = 9;
var NECROMANCER = 28;
var BOOK_OF_CHANGES = 49;
var SHAPESHIFTER = 51;
var MIRAGE = 52;
var DOPPELGANGER = 53;

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, SHAPESHIFTER, BOOK_OF_CHANGES, ISLAND];
