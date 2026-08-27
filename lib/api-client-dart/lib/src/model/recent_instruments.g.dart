// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recent_instruments.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RecentInstruments extends RecentInstruments {
  @override
  final BuiltList<RecentInstrumentsInstrumentsInner> instruments;

  factory _$RecentInstruments(
          [void Function(RecentInstrumentsBuilder)? updates]) =>
      (RecentInstrumentsBuilder()..update(updates))._build();

  _$RecentInstruments._({required this.instruments}) : super._();
  @override
  RecentInstruments rebuild(void Function(RecentInstrumentsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RecentInstrumentsBuilder toBuilder() =>
      RecentInstrumentsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RecentInstruments && instruments == other.instruments;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instruments.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RecentInstruments')
          ..add('instruments', instruments))
        .toString();
  }
}

class RecentInstrumentsBuilder
    implements Builder<RecentInstruments, RecentInstrumentsBuilder> {
  _$RecentInstruments? _$v;

  ListBuilder<RecentInstrumentsInstrumentsInner>? _instruments;
  ListBuilder<RecentInstrumentsInstrumentsInner> get instruments =>
      _$this._instruments ??= ListBuilder<RecentInstrumentsInstrumentsInner>();
  set instruments(
          ListBuilder<RecentInstrumentsInstrumentsInner>? instruments) =>
      _$this._instruments = instruments;

  RecentInstrumentsBuilder() {
    RecentInstruments._defaults(this);
  }

  RecentInstrumentsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instruments = $v.instruments.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RecentInstruments other) {
    _$v = other as _$RecentInstruments;
  }

  @override
  void update(void Function(RecentInstrumentsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RecentInstruments build() => _build();

  _$RecentInstruments _build() {
    _$RecentInstruments _$result;
    try {
      _$result = _$v ??
          _$RecentInstruments._(
            instruments: instruments.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'instruments';
        instruments.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RecentInstruments', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
