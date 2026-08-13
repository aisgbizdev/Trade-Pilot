// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_journal_entry_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateJournalEntryBodySideEnum _$updateJournalEntryBodySideEnum_buy =
    const UpdateJournalEntryBodySideEnum._('buy');
const UpdateJournalEntryBodySideEnum _$updateJournalEntryBodySideEnum_sell =
    const UpdateJournalEntryBodySideEnum._('sell');

UpdateJournalEntryBodySideEnum _$updateJournalEntryBodySideEnumValueOf(
    String name) {
  switch (name) {
    case 'buy':
      return _$updateJournalEntryBodySideEnum_buy;
    case 'sell':
      return _$updateJournalEntryBodySideEnum_sell;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateJournalEntryBodySideEnum>
    _$updateJournalEntryBodySideEnumValues = BuiltSet<
        UpdateJournalEntryBodySideEnum>(const <UpdateJournalEntryBodySideEnum>[
  _$updateJournalEntryBodySideEnum_buy,
  _$updateJournalEntryBodySideEnum_sell,
]);

const UpdateJournalEntryBodyOutcomeEnum
    _$updateJournalEntryBodyOutcomeEnum_win =
    const UpdateJournalEntryBodyOutcomeEnum._('win');
const UpdateJournalEntryBodyOutcomeEnum
    _$updateJournalEntryBodyOutcomeEnum_loss =
    const UpdateJournalEntryBodyOutcomeEnum._('loss');
const UpdateJournalEntryBodyOutcomeEnum
    _$updateJournalEntryBodyOutcomeEnum_breakeven =
    const UpdateJournalEntryBodyOutcomeEnum._('breakeven');
const UpdateJournalEntryBodyOutcomeEnum
    _$updateJournalEntryBodyOutcomeEnum_open =
    const UpdateJournalEntryBodyOutcomeEnum._('open');
const UpdateJournalEntryBodyOutcomeEnum
    _$updateJournalEntryBodyOutcomeEnum_skipped =
    const UpdateJournalEntryBodyOutcomeEnum._('skipped');

UpdateJournalEntryBodyOutcomeEnum _$updateJournalEntryBodyOutcomeEnumValueOf(
    String name) {
  switch (name) {
    case 'win':
      return _$updateJournalEntryBodyOutcomeEnum_win;
    case 'loss':
      return _$updateJournalEntryBodyOutcomeEnum_loss;
    case 'breakeven':
      return _$updateJournalEntryBodyOutcomeEnum_breakeven;
    case 'open':
      return _$updateJournalEntryBodyOutcomeEnum_open;
    case 'skipped':
      return _$updateJournalEntryBodyOutcomeEnum_skipped;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<UpdateJournalEntryBodyOutcomeEnum>
    _$updateJournalEntryBodyOutcomeEnumValues = BuiltSet<
        UpdateJournalEntryBodyOutcomeEnum>(const <UpdateJournalEntryBodyOutcomeEnum>[
  _$updateJournalEntryBodyOutcomeEnum_win,
  _$updateJournalEntryBodyOutcomeEnum_loss,
  _$updateJournalEntryBodyOutcomeEnum_breakeven,
  _$updateJournalEntryBodyOutcomeEnum_open,
  _$updateJournalEntryBodyOutcomeEnum_skipped,
]);

Serializer<UpdateJournalEntryBodySideEnum>
    _$updateJournalEntryBodySideEnumSerializer =
    _$UpdateJournalEntryBodySideEnumSerializer();
Serializer<UpdateJournalEntryBodyOutcomeEnum>
    _$updateJournalEntryBodyOutcomeEnumSerializer =
    _$UpdateJournalEntryBodyOutcomeEnumSerializer();

class _$UpdateJournalEntryBodySideEnumSerializer
    implements PrimitiveSerializer<UpdateJournalEntryBodySideEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'buy': 'buy',
    'sell': 'sell',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'buy': 'buy',
    'sell': 'sell',
  };

  @override
  final Iterable<Type> types = const <Type>[UpdateJournalEntryBodySideEnum];
  @override
  final String wireName = 'UpdateJournalEntryBodySideEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateJournalEntryBodySideEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateJournalEntryBodySideEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateJournalEntryBodySideEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateJournalEntryBodyOutcomeEnumSerializer
    implements PrimitiveSerializer<UpdateJournalEntryBodyOutcomeEnum> {
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
  final Iterable<Type> types = const <Type>[UpdateJournalEntryBodyOutcomeEnum];
  @override
  final String wireName = 'UpdateJournalEntryBodyOutcomeEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateJournalEntryBodyOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateJournalEntryBodyOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateJournalEntryBodyOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateJournalEntryBody extends UpdateJournalEntryBody {
  @override
  final int? analysisId;
  @override
  final String? instrument;
  @override
  final UpdateJournalEntryBodySideEnum? side;
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
  final UpdateJournalEntryBodyOutcomeEnum? outcome;
  @override
  final String? mood;
  @override
  final String? note;
  @override
  final DateTime? tradedAt;

  factory _$UpdateJournalEntryBody(
          [void Function(UpdateJournalEntryBodyBuilder)? updates]) =>
      (UpdateJournalEntryBodyBuilder()..update(updates))._build();

  _$UpdateJournalEntryBody._(
      {this.analysisId,
      this.instrument,
      this.side,
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
  UpdateJournalEntryBody rebuild(
          void Function(UpdateJournalEntryBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateJournalEntryBodyBuilder toBuilder() =>
      UpdateJournalEntryBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateJournalEntryBody &&
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
    return (newBuiltValueToStringHelper(r'UpdateJournalEntryBody')
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

class UpdateJournalEntryBodyBuilder
    implements Builder<UpdateJournalEntryBody, UpdateJournalEntryBodyBuilder> {
  _$UpdateJournalEntryBody? _$v;

  int? _analysisId;
  int? get analysisId => _$this._analysisId;
  set analysisId(int? analysisId) => _$this._analysisId = analysisId;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  UpdateJournalEntryBodySideEnum? _side;
  UpdateJournalEntryBodySideEnum? get side => _$this._side;
  set side(UpdateJournalEntryBodySideEnum? side) => _$this._side = side;

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

  UpdateJournalEntryBodyOutcomeEnum? _outcome;
  UpdateJournalEntryBodyOutcomeEnum? get outcome => _$this._outcome;
  set outcome(UpdateJournalEntryBodyOutcomeEnum? outcome) =>
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

  UpdateJournalEntryBodyBuilder() {
    UpdateJournalEntryBody._defaults(this);
  }

  UpdateJournalEntryBodyBuilder get _$this {
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
  void replace(UpdateJournalEntryBody other) {
    _$v = other as _$UpdateJournalEntryBody;
  }

  @override
  void update(void Function(UpdateJournalEntryBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateJournalEntryBody build() => _build();

  _$UpdateJournalEntryBody _build() {
    _$UpdateJournalEntryBody _$result;
    try {
      _$result = _$v ??
          _$UpdateJournalEntryBody._(
            analysisId: analysisId,
            instrument: instrument,
            side: side,
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
            r'UpdateJournalEntryBody', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
