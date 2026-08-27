// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rule_text.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StandardTradingRuleText extends StandardTradingRuleText {
  @override
  final String id;
  @override
  final String en;

  factory _$StandardTradingRuleText(
          [void Function(StandardTradingRuleTextBuilder)? updates]) =>
      (StandardTradingRuleTextBuilder()..update(updates))._build();

  _$StandardTradingRuleText._({required this.id, required this.en}) : super._();
  @override
  StandardTradingRuleText rebuild(
          void Function(StandardTradingRuleTextBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRuleTextBuilder toBuilder() =>
      StandardTradingRuleTextBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRuleText && id == other.id && en == other.en;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, en.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StandardTradingRuleText')
          ..add('id', id)
          ..add('en', en))
        .toString();
  }
}

class StandardTradingRuleTextBuilder
    implements
        Builder<StandardTradingRuleText, StandardTradingRuleTextBuilder> {
  _$StandardTradingRuleText? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _en;
  String? get en => _$this._en;
  set en(String? en) => _$this._en = en;

  StandardTradingRuleTextBuilder() {
    StandardTradingRuleText._defaults(this);
  }

  StandardTradingRuleTextBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _en = $v.en;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRuleText other) {
    _$v = other as _$StandardTradingRuleText;
  }

  @override
  void update(void Function(StandardTradingRuleTextBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRuleText build() => _build();

  _$StandardTradingRuleText _build() {
    final _$result = _$v ??
        _$StandardTradingRuleText._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'StandardTradingRuleText', 'id'),
          en: BuiltValueNullFieldError.checkNotNull(
              en, r'StandardTradingRuleText', 'en'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
