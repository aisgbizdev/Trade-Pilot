// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_summary_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DailySummaryResponse extends DailySummaryResponse {
  @override
  final DailySummarySettings settings;
  @override
  final DailySummaryToday? today;

  factory _$DailySummaryResponse(
          [void Function(DailySummaryResponseBuilder)? updates]) =>
      (DailySummaryResponseBuilder()..update(updates))._build();

  _$DailySummaryResponse._({required this.settings, this.today}) : super._();
  @override
  DailySummaryResponse rebuild(
          void Function(DailySummaryResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DailySummaryResponseBuilder toBuilder() =>
      DailySummaryResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySummaryResponse &&
        settings == other.settings &&
        today == other.today;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, settings.hashCode);
    _$hash = $jc(_$hash, today.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DailySummaryResponse')
          ..add('settings', settings)
          ..add('today', today))
        .toString();
  }
}

class DailySummaryResponseBuilder
    implements Builder<DailySummaryResponse, DailySummaryResponseBuilder> {
  _$DailySummaryResponse? _$v;

  DailySummarySettingsBuilder? _settings;
  DailySummarySettingsBuilder get settings =>
      _$this._settings ??= DailySummarySettingsBuilder();
  set settings(DailySummarySettingsBuilder? settings) =>
      _$this._settings = settings;

  DailySummaryTodayBuilder? _today;
  DailySummaryTodayBuilder get today =>
      _$this._today ??= DailySummaryTodayBuilder();
  set today(DailySummaryTodayBuilder? today) => _$this._today = today;

  DailySummaryResponseBuilder() {
    DailySummaryResponse._defaults(this);
  }

  DailySummaryResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _settings = $v.settings.toBuilder();
      _today = $v.today?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DailySummaryResponse other) {
    _$v = other as _$DailySummaryResponse;
  }

  @override
  void update(void Function(DailySummaryResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DailySummaryResponse build() => _build();

  _$DailySummaryResponse _build() {
    _$DailySummaryResponse _$result;
    try {
      _$result = _$v ??
          _$DailySummaryResponse._(
            settings: settings.build(),
            today: _today?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'settings';
        settings.build();
        _$failedField = 'today';
        _today?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DailySummaryResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
