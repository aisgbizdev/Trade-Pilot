// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_journal_entry_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateJournalEntryBodySideEnum _$createJournalEntryBodySideEnum_buy =
    const CreateJournalEntryBodySideEnum._('buy');
const CreateJournalEntryBodySideEnum _$createJournalEntryBodySideEnum_sell =
    const CreateJournalEntryBodySideEnum._('sell');

CreateJournalEntryBodySideEnum _$createJournalEntryBodySideEnumValueOf(
    String name) {
  switch (name) {
    case 'buy':
      return _$createJournalEntryBodySideEnum_buy;
    case 'sell':
      return _$createJournalEntryBodySideEnum_sell;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateJournalEntryBodySideEnum>
    _$createJournalEntryBodySideEnumValues = BuiltSet<
        CreateJournalEntryBodySideEnum>(const <CreateJournalEntryBodySideEnum>[
  _$createJournalEntryBodySideEnum_buy,
  _$createJournalEntryBodySideEnum_sell,
]);

const CreateJournalEntryBodyOutcomeEnum
    _$createJournalEntryBodyOutcomeEnum_win =
    const CreateJournalEntryBodyOutcomeEnum._('win');
const CreateJournalEntryBodyOutcomeEnum
    _$createJournalEntryBodyOutcomeEnum_loss =
    const CreateJournalEntryBodyOutcomeEnum._('loss');
const CreateJournalEntryBodyOutcomeEnum
    _$createJournalEntryBodyOutcomeEnum_breakeven =
    const CreateJournalEntryBodyOutcomeEnum._('breakeven');
const CreateJournalEntryBodyOutcomeEnum
    _$createJournalEntryBodyOutcomeEnum_open =
    const CreateJournalEntryBodyOutcomeEnum._('open');
const CreateJournalEntryBodyOutcomeEnum
    _$createJournalEntryBodyOutcomeEnum_skipped =
    const CreateJournalEntryBodyOutcomeEnum._('skipped');

CreateJournalEntryBodyOutcomeEnum _$createJournalEntryBodyOutcomeEnumValueOf(
    String name) {
  switch (name) {
    case 'win':
      return _$createJournalEntryBodyOutcomeEnum_win;
    case 'loss':
      return _$createJournalEntryBodyOutcomeEnum_loss;
    case 'breakeven':
      return _$createJournalEntryBodyOutcomeEnum_breakeven;
    case 'open':
      return _$createJournalEntryBodyOutcomeEnum_open;
    case 'skipped':
      return _$createJournalEntryBodyOutcomeEnum_skipped;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateJournalEntryBodyOutcomeEnum>
    _$createJournalEntryBodyOutcomeEnumValues = BuiltSet<
        CreateJournalEntryBodyOutcomeEnum>(const <CreateJournalEntryBodyOutcomeEnum>[
  _$createJournalEntryBodyOutcomeEnum_win,
  _$createJournalEntryBodyOutcomeEnum_loss,
  _$createJournalEntryBodyOutcomeEnum_breakeven,
  _$createJournalEntryBodyOutcomeEnum_open,
  _$createJournalEntryBodyOutcomeEnum_skipped,
]);

Serializer<CreateJournalEntryBodySideEnum>
    _$createJournalEntryBodySideEnumSerializer =
    _$CreateJournalEntryBodySideEnumSerializer();
Serializer<CreateJournalEntryBodyOutcomeEnum>
    _$createJournalEntryBodyOutcomeEnumSerializer =
    _$CreateJournalEntryBodyOutcomeEnumSerializer();

class _$CreateJournalEntryBodySideEnumSerializer
    implements PrimitiveSerializer<CreateJournalEntryBodySideEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'buy': 'buy',
    'sell': 'sell',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'buy': 'buy',
    'sell': 'sell',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateJournalEntryBodySideEnum];
  @override
  final String wireName = 'CreateJournalEntryBodySideEnum';

  @override
  Object serialize(
          Serializers serializers, CreateJournalEntryBodySideEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateJournalEntryBodySideEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateJournalEntryBodySideEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateJournalEntryBodyOutcomeEnumSerializer
    implements PrimitiveSerializer<CreateJournalEntryBodyOutcomeEnum> {
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
  final Iterable<Type> types = const <Type>[CreateJournalEntryBodyOutcomeEnum];
  @override
  final String wireName = 'CreateJournalEntryBodyOutcomeEnum';

  @override
  Object serialize(
          Serializers serializers, CreateJournalEntryBodyOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateJournalEntryBodyOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateJournalEntryBodyOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateJournalEntryBody extends CreateJournalEntryBody {
  @override
  final int? analysisId;
  @override
  final String instrument;
  @override
  final CreateJournalEntryBodySideEnum side;
  @override
  final CreateJournalEntryBodyEntryPrice? entryPrice;
  @override
  final CreateJournalEntryBodyEntryPrice? exitPrice;
  @override
  final CreateJournalEntryBodyEntryPrice? quantity;
  @override
  final CreateJournalEntryBodyEntryPrice? pnlAmount;
  @override
  final CreateJournalEntryBodyEntryPrice? pnlPercent;
  @override
  final CreateJournalEntryBodyOutcomeEnum? outcome;
  @override
  final String? mood;
  @override
  final String? note;
  @override
  final DateTime? tradedAt;

  factory _$CreateJournalEntryBody(
          [void Function(CreateJournalEntryBodyBuilder)? updates]) =>
      (CreateJournalEntryBodyBuilder()..update(updates))._build();

  _$CreateJournalEntryBody._(
      {this.analysisId,
      required this.instrument,
      required this.side,
      this.entryPrice,
      this.exitPrice,
      this.quantity,
      this.pnlAmount,
      this.pnlPercent,
      this.outcome,
      this.mood,
      this.note,
      this.tradedAt})
      : super._();
  @override
  CreateJournalEntryBody rebuild(
          void Function(CreateJournalEntryBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateJournalEntryBodyBuilder toBuilder() =>
      CreateJournalEntryBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateJournalEntryBody &&
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
        tradedAt == other.tradedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
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
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateJournalEntryBody')
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
          ..add('tradedAt', tradedAt))
        .toString();
  }
}

class CreateJournalEntryBodyBuilder
    implements Builder<CreateJournalEntryBody, CreateJournalEntryBodyBuilder> {
  _$CreateJournalEntryBody? _$v;

  int? _analysisId;
  int? get analysisId => _$this._analysisId;
  set analysisId(int? analysisId) => _$this._analysisId = analysisId;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  CreateJournalEntryBodySideEnum? _side;
  CreateJournalEntryBodySideEnum? get side => _$this._side;
  set side(CreateJournalEntryBodySideEnum? side) => _$this._side = side;

  CreateJournalEntryBodyEntryPriceBuilder? _entryPrice;
  CreateJournalEntryBodyEntryPriceBuilder get entryPrice =>
      _$this._entryPrice ??= CreateJournalEntryBodyEntryPriceBuilder();
  set entryPrice(CreateJournalEntryBodyEntryPriceBuilder? entryPrice) =>
      _$this._entryPrice = entryPrice;

  CreateJournalEntryBodyEntryPriceBuilder? _exitPrice;
  CreateJournalEntryBodyEntryPriceBuilder get exitPrice =>
      _$this._exitPrice ??= CreateJournalEntryBodyEntryPriceBuilder();
  set exitPrice(CreateJournalEntryBodyEntryPriceBuilder? exitPrice) =>
      _$this._exitPrice = exitPrice;

  CreateJournalEntryBodyEntryPriceBuilder? _quantity;
  CreateJournalEntryBodyEntryPriceBuilder get quantity =>
      _$this._quantity ??= CreateJournalEntryBodyEntryPriceBuilder();
  set quantity(CreateJournalEntryBodyEntryPriceBuilder? quantity) =>
      _$this._quantity = quantity;

  CreateJournalEntryBodyEntryPriceBuilder? _pnlAmount;
  CreateJournalEntryBodyEntryPriceBuilder get pnlAmount =>
      _$this._pnlAmount ??= CreateJournalEntryBodyEntryPriceBuilder();
  set pnlAmount(CreateJournalEntryBodyEntryPriceBuilder? pnlAmount) =>
      _$this._pnlAmount = pnlAmount;

  CreateJournalEntryBodyEntryPriceBuilder? _pnlPercent;
  CreateJournalEntryBodyEntryPriceBuilder get pnlPercent =>
      _$this._pnlPercent ??= CreateJournalEntryBodyEntryPriceBuilder();
  set pnlPercent(CreateJournalEntryBodyEntryPriceBuilder? pnlPercent) =>
      _$this._pnlPercent = pnlPercent;

  CreateJournalEntryBodyOutcomeEnum? _outcome;
  CreateJournalEntryBodyOutcomeEnum? get outcome => _$this._outcome;
  set outcome(CreateJournalEntryBodyOutcomeEnum? outcome) =>
      _$this._outcome = outcome;

  String? _mood;
  String? get mood => _$this._mood;
  set mood(String? mood) => _$this._mood = mood;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _tradedAt;
  DateTime? get tradedAt => _$this._tradedAt;
  set tradedAt(DateTime? tradedAt) => _$this._tradedAt = tradedAt;

  CreateJournalEntryBodyBuilder() {
    CreateJournalEntryBody._defaults(this);
  }

  CreateJournalEntryBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _analysisId = $v.analysisId;
      _instrument = $v.instrument;
      _side = $v.side;
      _entryPrice = $v.entryPrice?.toBuilder();
      _exitPrice = $v.exitPrice?.toBuilder();
      _quantity = $v.quantity?.toBuilder();
      _pnlAmount = $v.pnlAmount?.toBuilder();
      _pnlPercent = $v.pnlPercent?.toBuilder();
      _outcome = $v.outcome;
      _mood = $v.mood;
      _note = $v.note;
      _tradedAt = $v.tradedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateJournalEntryBody other) {
    _$v = other as _$CreateJournalEntryBody;
  }

  @override
  void update(void Function(CreateJournalEntryBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateJournalEntryBody build() => _build();

  _$CreateJournalEntryBody _build() {
    _$CreateJournalEntryBody _$result;
    try {
      _$result = _$v ??
          _$CreateJournalEntryBody._(
            analysisId: analysisId,
            instrument: BuiltValueNullFieldError.checkNotNull(
                instrument, r'CreateJournalEntryBody', 'instrument'),
            side: BuiltValueNullFieldError.checkNotNull(
                side, r'CreateJournalEntryBody', 'side'),
            entryPrice: _entryPrice?.build(),
            exitPrice: _exitPrice?.build(),
            quantity: _quantity?.build(),
            pnlAmount: _pnlAmount?.build(),
            pnlPercent: _pnlPercent?.build(),
            outcome: outcome,
            mood: mood,
            note: note,
            tradedAt: tradedAt,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'entryPrice';
        _entryPrice?.build();
        _$failedField = 'exitPrice';
        _exitPrice?.build();
        _$failedField = 'quantity';
        _quantity?.build();
        _$failedField = 'pnlAmount';
        _pnlAmount?.build();
        _$failedField = 'pnlPercent';
        _pnlPercent?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateJournalEntryBody', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
