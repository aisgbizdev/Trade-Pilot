// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trade_side.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TradeSide extends TradeSide {
  @override
  final String entryZone;
  @override
  final String stopLoss;
  @override
  final String takeProfit1;
  @override
  final String takeProfit2;
  @override
  final String riskRewardRatio;
  @override
  final String rationale;

  factory _$TradeSide([void Function(TradeSideBuilder)? updates]) =>
      (TradeSideBuilder()..update(updates))._build();

  _$TradeSide._(
      {required this.entryZone,
      required this.stopLoss,
      required this.takeProfit1,
      required this.takeProfit2,
      required this.riskRewardRatio,
      required this.rationale})
      : super._();
  @override
  TradeSide rebuild(void Function(TradeSideBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TradeSideBuilder toBuilder() => TradeSideBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TradeSide &&
        entryZone == other.entryZone &&
        stopLoss == other.stopLoss &&
        takeProfit1 == other.takeProfit1 &&
        takeProfit2 == other.takeProfit2 &&
        riskRewardRatio == other.riskRewardRatio &&
        rationale == other.rationale;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, entryZone.hashCode);
    _$hash = $jc(_$hash, stopLoss.hashCode);
    _$hash = $jc(_$hash, takeProfit1.hashCode);
    _$hash = $jc(_$hash, takeProfit2.hashCode);
    _$hash = $jc(_$hash, riskRewardRatio.hashCode);
    _$hash = $jc(_$hash, rationale.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TradeSide')
          ..add('entryZone', entryZone)
          ..add('stopLoss', stopLoss)
          ..add('takeProfit1', takeProfit1)
          ..add('takeProfit2', takeProfit2)
          ..add('riskRewardRatio', riskRewardRatio)
          ..add('rationale', rationale))
        .toString();
  }
}

class TradeSideBuilder implements Builder<TradeSide, TradeSideBuilder> {
  _$TradeSide? _$v;

  String? _entryZone;
  String? get entryZone => _$this._entryZone;
  set entryZone(String? entryZone) => _$this._entryZone = entryZone;

  String? _stopLoss;
  String? get stopLoss => _$this._stopLoss;
  set stopLoss(String? stopLoss) => _$this._stopLoss = stopLoss;

  String? _takeProfit1;
  String? get takeProfit1 => _$this._takeProfit1;
  set takeProfit1(String? takeProfit1) => _$this._takeProfit1 = takeProfit1;

  String? _takeProfit2;
  String? get takeProfit2 => _$this._takeProfit2;
  set takeProfit2(String? takeProfit2) => _$this._takeProfit2 = takeProfit2;

  String? _riskRewardRatio;
  String? get riskRewardRatio => _$this._riskRewardRatio;
  set riskRewardRatio(String? riskRewardRatio) =>
      _$this._riskRewardRatio = riskRewardRatio;

  String? _rationale;
  String? get rationale => _$this._rationale;
  set rationale(String? rationale) => _$this._rationale = rationale;

  TradeSideBuilder() {
    TradeSide._defaults(this);
  }

  TradeSideBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _entryZone = $v.entryZone;
      _stopLoss = $v.stopLoss;
      _takeProfit1 = $v.takeProfit1;
      _takeProfit2 = $v.takeProfit2;
      _riskRewardRatio = $v.riskRewardRatio;
      _rationale = $v.rationale;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TradeSide other) {
    _$v = other as _$TradeSide;
  }

  @override
  void update(void Function(TradeSideBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TradeSide build() => _build();

  _$TradeSide _build() {
    final _$result = _$v ??
        _$TradeSide._(
          entryZone: BuiltValueNullFieldError.checkNotNull(
              entryZone, r'TradeSide', 'entryZone'),
          stopLoss: BuiltValueNullFieldError.checkNotNull(
              stopLoss, r'TradeSide', 'stopLoss'),
          takeProfit1: BuiltValueNullFieldError.checkNotNull(
              takeProfit1, r'TradeSide', 'takeProfit1'),
          takeProfit2: BuiltValueNullFieldError.checkNotNull(
              takeProfit2, r'TradeSide', 'takeProfit2'),
          riskRewardRatio: BuiltValueNullFieldError.checkNotNull(
              riskRewardRatio, r'TradeSide', 'riskRewardRatio'),
          rationale: BuiltValueNullFieldError.checkNotNull(
              rationale, r'TradeSide', 'rationale'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
