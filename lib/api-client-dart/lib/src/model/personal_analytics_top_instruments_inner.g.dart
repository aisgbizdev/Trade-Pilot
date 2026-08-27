// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'personal_analytics_top_instruments_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PersonalAnalyticsTopInstrumentsInner
    extends PersonalAnalyticsTopInstrumentsInner {
  @override
  final String instrument;
  @override
  final int count;

  factory _$PersonalAnalyticsTopInstrumentsInner(
          [void Function(PersonalAnalyticsTopInstrumentsInnerBuilder)?
              updates]) =>
      (PersonalAnalyticsTopInstrumentsInnerBuilder()..update(updates))._build();

  _$PersonalAnalyticsTopInstrumentsInner._(
      {required this.instrument, required this.count})
      : super._();
  @override
  PersonalAnalyticsTopInstrumentsInner rebuild(
          void Function(PersonalAnalyticsTopInstrumentsInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PersonalAnalyticsTopInstrumentsInnerBuilder toBuilder() =>
      PersonalAnalyticsTopInstrumentsInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PersonalAnalyticsTopInstrumentsInner &&
        instrument == other.instrument &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PersonalAnalyticsTopInstrumentsInner')
          ..add('instrument', instrument)
          ..add('count', count))
        .toString();
  }
}

class PersonalAnalyticsTopInstrumentsInnerBuilder
    implements
        Builder<PersonalAnalyticsTopInstrumentsInner,
            PersonalAnalyticsTopInstrumentsInnerBuilder> {
  _$PersonalAnalyticsTopInstrumentsInner? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  PersonalAnalyticsTopInstrumentsInnerBuilder() {
    PersonalAnalyticsTopInstrumentsInner._defaults(this);
  }

  PersonalAnalyticsTopInstrumentsInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PersonalAnalyticsTopInstrumentsInner other) {
    _$v = other as _$PersonalAnalyticsTopInstrumentsInner;
  }

  @override
  void update(
      void Function(PersonalAnalyticsTopInstrumentsInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PersonalAnalyticsTopInstrumentsInner build() => _build();

  _$PersonalAnalyticsTopInstrumentsInner _build() {
    final _$result = _$v ??
        _$PersonalAnalyticsTopInstrumentsInner._(
          instrument: BuiltValueNullFieldError.checkNotNull(instrument,
              r'PersonalAnalyticsTopInstrumentsInner', 'instrument'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'PersonalAnalyticsTopInstrumentsInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
