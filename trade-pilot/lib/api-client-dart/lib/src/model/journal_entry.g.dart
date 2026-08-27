// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_entry.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const JournalEntrySideEnum _$journalEntrySideEnum_buy =
    const JournalEntrySideEnum._('buy');
const JournalEntrySideEnum _$journalEntrySideEnum_sell =
    const JournalEntrySideEnum._('sell');

JournalEntrySideEnum _$journalEntrySideEnumValueOf(String name) {
  switch (name) {
    case 'buy':
      return _$journalEntrySideEnum_buy;
    case 'sell':
      return _$journalEntrySideEnum_sell;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<JournalEntrySideEnum> _$journalEntrySideEnumValues =
    BuiltSet<JournalEntrySideEnum>(const <JournalEntrySideEnum>[
  _$journalEntrySideEnum_buy,
  _$journalEntrySideEnum_sell,
]);

const JournalEntryOutcomeEnum _$journalEntryOutcomeEnum_win =
    const JournalEntryOutcomeEnum._('win');
const JournalEntryOutcomeEnum _$journalEntryOutcomeEnum_loss =
    const JournalEntryOutcomeEnum._('loss');
const JournalEntryOutcomeEnum _$journalEntryOutcomeEnum_breakeven =
    const JournalEntryOutcomeEnum._('breakeven');
const JournalEntryOutcomeEnum _$journalEntryOutcomeEnum_open =
    const JournalEntryOutcomeEnum._('open');
const JournalEntryOutcomeEnum _$journalEntryOutcomeEnum_skipped =
    const JournalEntryOutcomeEnum._('skipped');

JournalEntryOutcomeEnum _$journalEntryOutcomeEnumValueOf(String name) {
  switch (name) {
    case 'win':
      return _$journalEntryOutcomeEnum_win;
    case 'loss':
      return _$journalEntryOutcomeEnum_loss;
    case 'breakeven':
      return _$journalEntryOutcomeEnum_breakeven;
    case 'open':
      return _$journalEntryOutcomeEnum_open;
    case 'skipped':
      return _$journalEntryOutcomeEnum_skipped;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<JournalEntryOutcomeEnum> _$journalEntryOutcomeEnumValues =
    BuiltSet<JournalEntryOutcomeEnum>(const <JournalEntryOutcomeEnum>[
  _$journalEntryOutcomeEnum_win,
  _$journalEntryOutcomeEnum_loss,
  _$journalEntryOutcomeEnum_breakeven,
  _$journalEntryOutcomeEnum_open,
  _$journalEntryOutcomeEnum_skipped,
]);

Serializer<JournalEntrySideEnum> _$journalEntrySideEnumSerializer =
    _$JournalEntrySideEnumSerializer();
Serializer<JournalEntryOutcomeEnum> _$journalEntryOutcomeEnumSerializer =
    _$JournalEntryOutcomeEnumSerializer();

class _$JournalEntrySideEnumSerializer
    implements PrimitiveSerializer<JournalEntrySideEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'buy': 'buy',
    'sell': 'sell',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'buy': 'buy',
    'sell': 'sell',
  };

  @override
  final Iterable<Type> types = const <Type>[JournalEntrySideEnum];
  @override
  final String wireName = 'JournalEntrySideEnum';

  @override
  Object serialize(Serializers serializers, JournalEntrySideEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  JournalEntrySideEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      JournalEntrySideEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$JournalEntryOutcomeEnumSerializer
    implements PrimitiveSerializer<JournalEntryOutcomeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'win': 'win',
    'loss': 'loss',
    'breakeven': 'breakeven',
    'open': 'open',
    'skipped': 'skipped',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'win': 'win',
    'loss': 'loss',
    'breakeven': 'breakeven',
    'open': 'open',
    'skipped': 'skipped',
  };

  @override
  final Iterable<Type> types = const <Type>[JournalEntryOutcomeEnum];
  @override
  final String wireName = 'JournalEntryOutcomeEnum';

  @override
  Object serialize(Serializers serializers, JournalEntryOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  JournalEntryOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      JournalEntryOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$JournalEntry extends JournalEntry {
  @override
  final int id;
  @override
  final int? analysisId;
  @override
  final String instrument;
  @override
  final JournalEntrySideEnum side;
  @override
  final String? entryPrice;
  @override
  final String? exitPrice;
  @override
  final String? quantity;
  @override
  final String? pnlAmount;
  @override
  final String? pnlPercent;
  @override
  final JournalEntryOutcomeEnum outcome;
  @override
  final String? mood;
  @override
  final String? note;
  @override
  final DateTime tradedAt;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$JournalEntry([void Function(JournalEntryBuilder)? updates]) =>
      (JournalEntryBuilder()..update(updates))._build();

  _$JournalEntry._(
      {required this.id,
      this.analysisId,
      required this.instrument,
      required this.side,
      this.entryPrice,
      this.exitPrice,
      this.quantity,
      this.pnlAmount,
      this.pnlPercent,
      required this.outcome,
      this.mood,
      this.note,
      required this.tradedAt,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  JournalEntry rebuild(void Function(JournalEntryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalEntryBuilder toBuilder() => JournalEntryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalEntry &&
        id == other.id &&
        analysisId == other.analysisId &&
        instrument == other.instrument &&
        side == other.side &&
        entryPrice == other.entryPrice &&
        exitPrice == other.exitPrice &&
        quantity == other.quantity &&
        pnlAmount == other.pnlAmount &&
        pnlPercent == other.pnlPercent &&
        outcome == other.outcome &&
        mood == other.mood &&
        note == other.note &&
        tradedAt == other.tradedAt &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, analysisId.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, side.hashCode);
    _$hash = $jc(_$hash, entryPrice.hashCode);
    _$hash = $jc(_$hash, exitPrice.hashCode);
    _$hash = $jc(_$hash, quantity.hashCode);
    _$hash = $jc(_$hash, pnlAmount.hashCode);
    _$hash = $jc(_$hash, pnlPercent.hashCode);
    _$hash = $jc(_$hash, outcome.hashCode);
    _$hash = $jc(_$hash, mood.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, tradedAt.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalEntry')
          ..add('id', id)
          ..add('analysisId', analysisId)
          ..add('instrument', instrument)
          ..add('side', side)
          ..add('entryPrice', entryPrice)
          ..add('exitPrice', exitPrice)
          ..add('quantity', quantity)
          ..add('pnlAmount', pnlAmount)
          ..add('pnlPercent', pnlPercent)
          ..add('outcome', outcome)
          ..add('mood', mood)
          ..add('note', note)
          ..add('tradedAt', tradedAt)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class JournalEntryBuilder
    implements Builder<JournalEntry, JournalEntryBuilder> {
  _$JournalEntry? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _analysisId;
  int? get analysisId => _$this._analysisId;
  set analysisId(int? analysisId) => _$this._analysisId = analysisId;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  JournalEntrySideEnum? _side;
  JournalEntrySideEnum? get side => _$this._side;
  set side(JournalEntrySideEnum? side) => _$this._side = side;

  String? _entryPrice;
  String? get entryPrice => _$this._entryPrice;
  set entryPrice(String? entryPrice) => _$this._entryPrice = entryPrice;

  String? _exitPrice;
  String? get exitPrice => _$this._exitPrice;
  set exitPrice(String? exitPrice) => _$this._exitPrice = exitPrice;

  String? _quantity;
  String? get quantity => _$this._quantity;
  set quantity(String? quantity) => _$this._quantity = quantity;

  String? _pnlAmount;
  String? get pnlAmount => _$this._pnlAmount;
  set pnlAmount(String? pnlAmount) => _$this._pnlAmount = pnlAmount;

  String? _pnlPercent;
  String? get pnlPercent => _$this._pnlPercent;
  set pnlPercent(String? pnlPercent) => _$this._pnlPercent = pnlPercent;

  JournalEntryOutcomeEnum? _outcome;
  JournalEntryOutcomeEnum? get outcome => _$this._outcome;
  set outcome(JournalEntryOutcomeEnum? outcome) => _$this._outcome = outcome;

  String? _mood;
  String? get mood => _$this._mood;
  set mood(String? mood) => _$this._mood = mood;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _tradedAt;
  DateTime? get tradedAt => _$this._tradedAt;
  set tradedAt(DateTime? tradedAt) => _$this._tradedAt = tradedAt;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  JournalEntryBuilder() {
    JournalEntry._defaults(this);
  }

  JournalEntryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _analysisId = $v.analysisId;
      _instrument = $v.instrument;
      _side = $v.side;
      _entryPrice = $v.entryPrice;
      _exitPrice = $v.exitPrice;
      _quantity = $v.quantity;
      _pnlAmount = $v.pnlAmount;
      _pnlPercent = $v.pnlPercent;
      _outcome = $v.outcome;
      _mood = $v.mood;
      _note = $v.note;
      _tradedAt = $v.tradedAt;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalEntry other) {
    _$v = other as _$JournalEntry;
  }

  @override
  void update(void Function(JournalEntryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalEntry build() => _build();

  _$JournalEntry _build() {
    final _$result = _$v ??
        _$JournalEntry._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'JournalEntry', 'id'),
          analysisId: analysisId,
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'JournalEntry', 'instrument'),
          side: BuiltValueNullFieldError.checkNotNull(
              side, r'JournalEntry', 'side'),
          entryPrice: entryPrice,
          exitPrice: exitPrice,
          quantity: quantity,
          pnlAmount: pnlAmount,
          pnlPercent: pnlPercent,
          outcome: BuiltValueNullFieldError.checkNotNull(
              outcome, r'JournalEntry', 'outcome'),
          mood: mood,
          note: note,
          tradedAt: BuiltValueNullFieldError.checkNotNull(
              tradedAt, r'JournalEntry', 'tradedAt'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'JournalEntry', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'JournalEntry', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
